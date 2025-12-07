import { connectDB, getDB } from './db-mysql.js';

await connectDB();
const db = getDB();

console.log('\n=== TESTING VERIFICATION ===\n');

// Test 1: Check tutorial certificate with correct ID
console.log('1️⃣ Tutorial Certificate with ID 244113:');
const [tuts1] = await db.execute(
  'SELECT * FROM tutorial_certificates WHERE certificate_id = ?',
  ['244113']
);
console.log(tuts1.length > 0 ? '✅ FOUND' : '❌ NOT FOUND');
if (tuts1.length > 0) {
  console.log(`   Student: ${tuts1[0].student_name}`);
  console.log(`   Course: ${tuts1[0].course_name}`);
}

// Test 2: Check with wrong ID (what user tried)
console.log('\n2️⃣ Tutorial Certificate with ID 2441113 (wrong):');
const [tuts2] = await db.execute(
  'SELECT * FROM tutorial_certificates WHERE certificate_id = ?',
  ['2441113']
);
console.log(tuts2.length > 0 ? '✅ FOUND' : '❌ NOT FOUND (This is expected - typo)');

// Test 3: Check educational certificates
console.log('\n3️⃣ Educational Certificates (first 3):');
const [eds] = await db.execute(
  'SELECT roll_number, student_name, degree FROM educational_certificates LIMIT 3'
);
eds.forEach((e, i) => {
  console.log(`   ${i+1}. Roll: ${e.roll_number}, Name: ${e.student_name}`);
});

// Test 4: Check medicines
console.log('\n4️⃣ Medicines (first 3):');
const [meds] = await db.execute(
  'SELECT medicine_code, medicine_name FROM medicines LIMIT 3'
);
meds.forEach((m, i) => {
  console.log(`   ${i+1}. Code: ${m.medicine_code}, Name: ${m.medicine_name}`);
});

// Test 5: Check products
console.log('\n5️⃣ Products (first 3):');
const [prods] = await db.execute(
  'SELECT product_code, product_name FROM products LIMIT 3'
);
prods.forEach((p, i) => {
  console.log(`   ${i+1}. Code: ${p.product_code}, Name: ${p.product_name}`);
});

await db.end();
console.log('\n=== TEST COMPLETE ===\n');
