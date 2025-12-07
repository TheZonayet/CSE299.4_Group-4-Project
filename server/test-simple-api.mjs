import http from 'http';
import { connectDB, getDB } from './db-mysql.js';
import jwt from 'jsonwebtoken';

await connectDB();
const db = getDB();

// Get a test user
const [users] = await db.execute('SELECT id, email, role FROM users LIMIT 1');
const testUser = users[0];

// Create a test JWT token
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const testToken = jwt.sign(
  { sub: testUser.id, role: testUser.role },
  JWT_SECRET,
  { expiresIn: '2h' }
);

console.log('🧪 Testing API with Certificate ID 244113...\n');

const payload = JSON.stringify({ certificateId: '244113' });

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/tutorial/verify',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${testToken}`,
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  console.log(`Status: ${res.statusCode}\n`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Response:', data);
    }
    db.end();
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  db.end();
  process.exit(1);
});

req.write(payload);
req.end();
