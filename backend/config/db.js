const { Pool } = require('pg');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * Smart Database Configuration
 * Works seamlessly in Local (Docker/Native) and Production (Vercel/Supabase)
 * Uses modern WHATWG URL API for URI construction
 */

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && process.env.DB_HOST) {
  // Use WHATWG URL API to safely construct the URI
  const url = new URL('postgres://localhost');
  url.username = process.env.DB_USER || 'postgres';
  url.password = process.env.DB_PASSWORD || 'postgres';
  url.hostname = process.env.DB_HOST || 'localhost';
  url.port = process.env.DB_PORT || 5432;
  url.pathname = `/${process.env.DB_NAME || 'leyladigital'}`;
  dbUrl = url.toString();
}

// Determine SSL requirements
const isLocal = !dbUrl || 
                dbUrl.includes('localhost') || 
                dbUrl.includes('127.0.0.1') || 
                dbUrl.includes('@postgres:');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isLocal ? false : {
    rejectUnauthorized: false
  },
  max: isLocal ? 10 : 1, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', err);
  if (!isLocal) process.exit(-1);
});

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    return res;
  } catch (error) {
    // Safely log URL without sensitive info
    const safeUrl = dbUrl ? dbUrl.replace(/:[^@]+@/, ':****@') : 'undefined';
    logger.error('Database connection test failed', { url: safeUrl, error: error.message });
    throw error;
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
};
