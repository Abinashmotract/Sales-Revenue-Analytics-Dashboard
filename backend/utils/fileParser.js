const XLSX = require('xlsx');
const fs = require('fs');
const csv = require('csv-parser');

const parseExcel = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      resolve(data);
    } catch (error) {
      reject(new Error(`Error parsing Excel file: ${error.message}`));
    }
  });
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(new Error(`Error parsing CSV file: ${error.message}`)));
  });
};

const parseFile = async (filePath, fileExtension) => {
  const ext = fileExtension.toLowerCase();
  
  if (ext === '.csv') {
    return await parseCSV(filePath);
  } else if (ext === '.xlsx' || ext === '.xls') {
    return await parseExcel(filePath);
  } else {
    throw new Error('Unsupported file format');
  }
};

// Detect data format type
const detectDataFormat = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  // Check for product review format
  if (keys.includes('product_id') || keys.includes('product_id') || 
      (keys.includes('discounted_price') && keys.includes('rating_count'))) {
    return 'product_review';
  }

  // Check for sales format
  if (keys.includes('date') && keys.includes('product_name') && 
      keys.includes('quantity') && keys.includes('unit_price')) {
    return 'sales';
  }

  // Try to detect by common field names
  if (keys.some(k => k.toLowerCase().includes('product')) && 
      keys.some(k => k.toLowerCase().includes('price'))) {
    return 'product_review';
  }

  return 'sales'; // Default to sales format
};

const validateSalesData = (data) => {
  const errors = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push('Data must be a non-empty array');
    return { valid: false, errors, format: null };
  }

  const format = detectDataFormat(data);

  if (format === 'product_review') {
    // Validate product review format
    data.forEach((row, index) => {
      const productId = row.product_id || row['product_id'] || '';
      const discountedPrice = row.discounted_price || row['discounted_price'] || '';
      const ratingCount = row.rating_count || row['rating_count'] || '';

      if (!productId) {
        errors.push(`Row ${index + 1}: Missing product_id`);
      }

      if (!discountedPrice && !row.actual_price && !row['actual_price']) {
        errors.push(`Row ${index + 1}: Missing price information`);
      }
    });
  } else {
    // Validate sales format
    const requiredFields = ['date', 'product_name', 'category', 'region', 'quantity', 'unit_price'];
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] && row[field] !== 0) {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });

      // Validate date format
      if (row.date && isNaN(new Date(row.date).getTime())) {
        errors.push(`Row ${index + 1}: Invalid date format`);
      }

      // Validate numeric fields
      if (row.quantity && isNaN(parseInt(row.quantity))) {
        errors.push(`Row ${index + 1}: Quantity must be a number`);
      }

      if (row.unit_price && isNaN(parseFloat(row.unit_price))) {
        errors.push(`Row ${index + 1}: Unit price must be a number`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    format
  };
};

// Extract price from string like "₹399.00" or "$99.99"
const extractPrice = (priceStr) => {
  if (!priceStr) return 0;
  // Remove currency symbols, commas, spaces, and any non-numeric characters except decimal point
  const priceString = String(priceStr).replace(/[₹$€£,\s]/g, '').replace(/[^\d.]/g, '');
  const price = parseFloat(priceString);
  // Return 0 if NaN or if price is negative or unreasonably large
  if (isNaN(price) || price < 0 || price > 10000000) {
    return 0;
  }
  return price;
};

// Extract number from string like "24,269"
const extractNumber = (numStr) => {
  if (!numStr) return 0;
  const numString = String(numStr).replace(/[,\s]/g, '');
  const num = parseInt(numString);
  return isNaN(num) ? 0 : num;
};

// Extract main category from hierarchical category
const extractCategory = (categoryStr) => {
  if (!categoryStr) return 'Uncategorized';
  const category = String(categoryStr).split('|')[0].trim();
  return category || 'Uncategorized';
};

const normalizeSalesData = (data, format) => {
  if (format === 'product_review') {
    // Transform product review data to sales data
    return data.map((row, index) => {
      const productId = String(row.product_id || row['product_id'] || `Product ${index + 1}`).trim();
      
      // Extract price (prefer discounted_price, fallback to actual_price)
      // Cap price at 10,000,000 to prevent overflow
      const discountedPrice = extractPrice(row.discounted_price || row['discounted_price']);
      const actualPrice = extractPrice(row.actual_price || row['actual_price']);
      const rawPrice = discountedPrice || actualPrice || 0;
      const unitPrice = Math.min(Math.max(0, rawPrice), 10000000);

      // Use rating_count as proxy for quantity sold
      // Estimate: assume 10% of people who rated actually purchased
      // Cap quantity at 1,000,000 to prevent overflow
      const ratingCount = extractNumber(row.rating_count || row['rating_count']);
      const estimatedQuantity = ratingCount > 0 ? Math.floor(ratingCount * 0.1) : 1;
      const quantity = Math.min(Math.max(1, estimatedQuantity), 1000000);

      // Extract category (take first part of hierarchical category)
      const category = extractCategory(row.category || row['Category'] || 'Uncategorized');

      // Generate date - use current date or distribute over last 30 days
      const daysAgo = index % 30;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      // Extract region from user_name or use default
      const userNames = String(row.user_name || row['user_name'] || '').split(',');
      const region = userNames.length > 0 ? 'Online' : 'Online'; // Default to Online for e-commerce

      // Calculate total revenue and cap at maximum DECIMAL(15,2) value
      const totalRevenue = Math.min(quantity * unitPrice, 9999999999999.99);

      return {
        date: date,
        product_name: productId,
        category: category,
        region: region,
        quantity: quantity,
        unit_price: unitPrice,
        total_revenue: totalRevenue
      };
    });
  } else {
    // Original sales data format
    return data.map(row => {
      const quantity = parseInt(row.quantity) || 0;
      const unitPrice = parseFloat(row.unit_price) || 0;
      // Calculate total revenue and cap at maximum DECIMAL(15,2) value
      const totalRevenue = Math.min(quantity * unitPrice, 9999999999999.99);

      return {
        date: new Date(row.date),
        product_name: String(row.product_name || row.product || row['Product Name'] || '').trim(),
        category: String(row.category || row['Category'] || '').trim(),
        region: String(row.region || row['Region'] || '').trim(),
        quantity: quantity,
        unit_price: unitPrice,
        total_revenue: totalRevenue
      };
    });
  }
};

module.exports = {
  parseFile,
  validateSalesData,
  normalizeSalesData,
  detectDataFormat
};
