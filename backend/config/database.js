const { Pool } = require('pg');
require('dotenv').config();

// Parse DATABASE_URL if provided (for Render/Heroku)
let poolConfig;

// Check for DATABASE_URL (Render provides this automatically)
if (process.env.DATABASE_URL) {
  // Use connection string directly - pg library handles parsing
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Render PostgreSQL
    }
  };
  console.log('Using DATABASE_URL connection string');
  console.log('Database URL detected:', process.env.DATABASE_URL.substring(0, 30) + '...');
} else {
  // Use individual environment variables (for local development)
  const isProduction = process.env.NODE_ENV === 'production';
  
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'sales_analytics',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    // Enable SSL for production even with individual vars (Render requirement)
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
  console.log('Using individual DB environment variables');
  console.log('Host:', poolConfig.host);
  console.log('Database:', poolConfig.database);
  console.log('SSL:', poolConfig.ssl ? 'enabled' : 'disabled');
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database:', poolConfig.database);
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
