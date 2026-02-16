const pool = require('./database');

const initDatabase = async () => {
  try {
    // Create sales table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        region VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(15, 2) NOT NULL,
        total_revenue DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Alter existing columns if they have smaller precision (for existing databases)
    try {
      await pool.query(`
        ALTER TABLE sales 
        ALTER COLUMN unit_price TYPE DECIMAL(15, 2),
        ALTER COLUMN total_revenue TYPE DECIMAL(15, 2);
      `);
    } catch (alterError) {
      // Ignore error if columns don't exist or already have correct type
      // This is expected for new databases
      if (!alterError.message.includes('does not exist') && 
          !alterError.message.includes('column') &&
          !alterError.message.includes('already')) {
        console.warn('Warning: Could not alter columns:', alterError.message);
      }
    }

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
      CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_name);
      CREATE INDEX IF NOT EXISTS idx_sales_category ON sales(category);
      CREATE INDEX IF NOT EXISTS idx_sales_region ON sales(region);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = initDatabase;
