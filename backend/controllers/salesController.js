const pool = require('../config/database');
const { parseFile, validateSalesData, normalizeSalesData } = require('../utils/fileParser');
const fs = require('fs');
const path = require('path');

// Import sales data from CSV/Excel
const importSalesData = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname);

    // Parse file
    const rawData = await parseFile(filePath, fileExtension);

    // Validate data
    const validation = validateSalesData(rawData);
    if (!validation.valid) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Data validation failed',
        errors: validation.errors
      });
    }

    // Normalize data based on detected format
    const normalizedData = normalizeSalesData(rawData, validation.format);

    // Insert data into database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertQuery = `
        INSERT INTO sales (date, product_name, category, region, quantity, unit_price, total_revenue)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      for (const row of normalizedData) {
        await client.query(insertQuery, [
          row.date,
          row.product_name,
          row.category,
          row.region,
          row.quantity,
          row.unit_price,
          row.total_revenue
        ]);
      }

      await client.query('COMMIT');

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.status(201).json({
        success: true,
        message: `Successfully imported ${normalizedData.length} sales records`,
        recordsImported: normalizedData.length
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    next(error);
  }
};

// Get total sales and revenue for a period
const getTotalSalesRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(quantity) as total_quantity,
        SUM(total_revenue) as total_revenue
      FROM sales
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        totalTransactions: parseInt(result.rows[0].total_transactions) || 0,
        totalQuantity: parseInt(result.rows[0].total_quantity) || 0,
        totalRevenue: parseFloat(result.rows[0].total_revenue) || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get filtered sales data
const getFilteredSales = async (req, res, next) => {
  try {
    const { startDate, endDate, product, category, region, page = 1, limit = 100 } = req.query;

    let query = `
      SELECT 
        id,
        date,
        product_name,
        category,
        region,
        quantity,
        unit_price,
        total_revenue
      FROM sales
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    if (product) {
      paramCount++;
      query += ` AND LOWER(product_name) LIKE LOWER($${paramCount})`;
      params.push(`%${product}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND LOWER(category) LIKE LOWER($${paramCount})`;
      params.push(`%${category}%`);
    }

    if (region) {
      paramCount++;
      query += ` AND LOWER(region) LIKE LOWER($${paramCount})`;
      params.push(`%${region}%`);
    }

    // Get total count
    const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` ORDER BY date DESC LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get sales trend data (daily, weekly, monthly)
const getSalesTrend = async (req, res, next) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period. Must be daily, weekly, or monthly'
      });
    }

    let dateFormat, groupBy;
    switch (period) {
      case 'daily':
        dateFormat = "TO_CHAR(date, 'YYYY-MM-DD')";
        groupBy = "TO_CHAR(date, 'YYYY-MM-DD')";
        break;
      case 'weekly':
        dateFormat = "TO_CHAR(date, 'IYYY-IW')";
        groupBy = "TO_CHAR(date, 'IYYY-IW')";
        break;
      case 'monthly':
        dateFormat = "TO_CHAR(date, 'YYYY-MM')";
        groupBy = "TO_CHAR(date, 'YYYY-MM')";
        break;
    }

    let query = `
      SELECT 
        ${dateFormat} as period,
        SUM(quantity) as total_quantity,
        SUM(total_revenue) as total_revenue,
        COUNT(*) as transaction_count
      FROM sales
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` GROUP BY ${groupBy} ORDER BY period ASC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        period: row.period,
        totalQuantity: parseInt(row.total_quantity) || 0,
        totalRevenue: parseFloat(row.total_revenue) || 0,
        transactionCount: parseInt(row.transaction_count) || 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get Product Wise Sales
const getProductWiseSales = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        product_name,
        SUM(quantity) as total_quantity,
        SUM(total_revenue) as total_revenue,
        COUNT(*) as transaction_count
      FROM sales
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` GROUP BY product_name ORDER BY total_revenue DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        productName: row.product_name,
        totalQuantity: parseInt(row.total_quantity) || 0,
        totalRevenue: parseFloat(row.total_revenue) || 0,
        transactionCount: parseInt(row.transaction_count) || 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get Revenue By Region
const getRevenueByRegion = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        region,
        SUM(total_revenue) as total_revenue,
        SUM(quantity) as total_quantity,
        COUNT(*) as transaction_count
      FROM sales
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` GROUP BY region ORDER BY total_revenue DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        region: row.region,
        totalRevenue: parseFloat(row.total_revenue) || 0,
        totalQuantity: parseInt(row.total_quantity) || 0,
        transactionCount: parseInt(row.transaction_count) || 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get unique categories
const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM sales ORDER BY category');
    res.json({
      success: true,
      data: result.rows.map(row => row.category)
    });
  } catch (error) {
    next(error);
  }
};

// Get unique regions
const getRegions = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT DISTINCT region FROM sales ORDER BY region');
    res.json({
      success: true,
      data: result.rows.map(row => row.region)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  importSalesData,
  getTotalSalesRevenue,
  getFilteredSales,
  getSalesTrend,
  getProductWiseSales,
  getRevenueByRegion,
  getCategories,
  getRegions
};
