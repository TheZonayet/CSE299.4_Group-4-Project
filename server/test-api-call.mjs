import { connectDB, getDB } from './db-mysql.js';
import jwt from 'jsonwebtoken';
import https from 'https';

await connectDB();
const db = getDB();

// Get a test user
const [users] = await db.execute('SELECT id, email, role FROM users LIMIT 1');
const testUser = users[0];

if (!testUser) {
  console.log('❌ No users found in database!');
  process.exit(1);
}

// Create a test JWT token
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const testToken = jwt.sign(
  { sub: testUser.id, role: testUser.role },
  JWT_SECRET,
  { expiresIn: '2h' }
);

console.log('🧪 Testing API with Certificate ID 244113...\n');

// Test the tutorial verify endpoint
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/tutorial/verify',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${testToken}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:', JSON.parse(data));
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

// Try with HTTP instead
import http from 'http';

const httpReq = http.request(
  {
    hostname: 'localhost',
    port: 4000,
    path: '/api/tutorial/verify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${testToken}`
    }
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`✅ Status: ${res.statusCode}`);
      try {
        console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
      } catch (e) {
        console.log('Response:', data);
      }
      db.end();
      process.exit(0);
    });
  }
);

httpReq.on('error', (e) => {
  console.error('❌ Request error:', e.message);
  db.end();
  process.exit(1);
});

httpReq.write(JSON.stringify({ certificateId: '244113' }));
httpReq.end();
