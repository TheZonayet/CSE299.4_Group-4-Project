import mysql from 'mysql2/promise';
import 'dotenv/config';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'asure_verification_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

/**
 * Initialize MySQL connection pool
 */
export async function connectDB() {
  try {
    if (pool) return pool;
    
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error);
    throw error;
  }
}

/**
 * Get database connection pool
 */
export function getDB() {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return pool;
}

/**
 * Close database connection
 */
export async function closeDB() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
}

/**
 * Execute a query with parameters
 */
export async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

/**
 * Execute a transaction
 */
export async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default {
  connectDB,
  getDB,
  closeDB,
  query,
  transaction
};
