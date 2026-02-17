const { Pool } = require('pg');
require('dotenv').config();

// Parse DATABASE_URL if provided (for Render/Heroku)
let poolConfig;

if (process.env.DATABASE_URL) {
  // Parse PostgreSQL connection string
  // Format: postgresql://user:password@host:port/database
  try {
    // Handle both postgresql:// and postgres:// protocols
    const connectionString = process.env.DATABASE_URL.replace(/^postgres:/, 'postgresql:');
    const url = new URL(connectionString);
    
    poolConfig = {
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1), // Remove leading '/'
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
    console.log('Using DATABASE_URL connection string');
    console.log('Database:', poolConfig.database);
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    // Fallback to individual variables
    poolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'sales_analytics',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };
  }
} else {
  // Use individual environment variables (for local development)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'sales_analytics',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
  console.log('Using individual DB environment variables');
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
