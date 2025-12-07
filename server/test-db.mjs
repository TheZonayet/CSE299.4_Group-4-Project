import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asure_verification_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const [rows] = await pool.execute('SELECT COUNT(*) as cnt FROM users');
  console.log('✅ Database connection successful');
  console.log('Users count:', rows[0].cnt);
  
  const [users] = await pool.execute('SELECT id, email, role FROM users LIMIT 3');
  console.log('Sample users:', users);
  
  await pool.end();
} catch (error) {
  console.error('❌ Database error:', error.message);
  process.exit(1);
}
