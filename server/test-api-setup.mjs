import { connectDB, getDB } from './db-mysql.js';
import jwt from 'jsonwebtoken';

await connectDB();
const db = getDB();

// Get a test user
const [users] = await db.execute('SELECT id, email, role FROM users LIMIT 1');
const testUser = users[0];

if (!testUser) {
  console.log('❌ No users found in database!');
  process.exit(1);
}

console.log('✅ Test User:', testUser);

// Create a test JWT token
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const testToken = jwt.sign(
  { sub: testUser.id, role: testUser.role },
  JWT_SECRET,
  { expiresIn: '2h' }
);

console.log('✅ Generated Test Token:', testToken);

// Check educational certificate
console.log('\n📚 Educational Certificates:');
const [certs] = await db.execute(
  'SELECT roll_number, student_name FROM educational_certificates LIMIT 1'
);
if (certs.length > 0) {
  console.log(`   Try: roll=${certs[0].roll_number}`);
  console.log(`   Payload: { "rollNumber": "${certs[0].roll_number}" }`);
}

// Check medicine
console.log('\n💊 Medicines:');
const [meds] = await db.execute(
  'SELECT medicine_code, medicine_name FROM medicines LIMIT 1'
);
if (meds.length > 0) {
  console.log(`   Try: code=${meds[0].medicine_code}`);
  console.log(`   Payload: { "medicineCode": "${meds[0].medicine_code}" }`);
}

// Check product
console.log('\n📦 Products:');
const [prods] = await db.execute(
  'SELECT product_code, product_name FROM products LIMIT 1'
);
if (prods.length > 0) {
  console.log(`   Try: barcode=${prods[0].product_code}`);
  console.log(`   Payload: { "barcode": "${prods[0].product_code}" }`);
}

// Check tutorial
console.log('\n🎓 Tutorial Certificates:');
const [tuts] = await db.execute(
  'SELECT certificate_id, student_name FROM tutorial_certificates LIMIT 1'
);
if (tuts.length > 0) {
  console.log(`   Try: id=${tuts[0].certificate_id}`);
  console.log(`   Payload: { "certificateId": "${tuts[0].certificate_id}" }`);
}

// Check user credits
console.log('\n💰 User Credits:');
const [userCreds] = await db.execute(
  'SELECT verification_credits, monthly_credits_used FROM users WHERE id = ?',
  [testUser.id]
);
if (userCreds.length > 0) {
  console.log(`   verification_credits: ${userCreds[0].verification_credits}`);
  console.log(`   monthly_credits_used: ${userCreds[0].monthly_credits_used}`);
}

console.log('\n✅ Setup complete! Use the token above for API testing');
await db.end();
