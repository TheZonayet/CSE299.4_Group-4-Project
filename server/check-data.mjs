import { connectDB, getDB } from './db-mysql.js';

await connectDB();
const db = getDB();

console.log('\n📚 Educational Certificates:');
const [certs] = await db.execute('SELECT certificate_id, student_name, degree, roll_number FROM educational_certificates LIMIT 10');
console.log(JSON.stringify(certs, null, 2));

console.log('\n💊 Medicines:');
const [meds] = await db.execute('SELECT medicine_code, medicine_name FROM medicines LIMIT 10');
console.log(JSON.stringify(meds, null, 2));

console.log('\n📦 Products:');
const [prods] = await db.execute('SELECT product_code, product_name FROM products LIMIT 10');
console.log(JSON.stringify(prods, null, 2));

console.log('\n🎓 Tutorial Certificates:');
const [tuts] = await db.execute('SELECT certificate_id, student_name, course_name FROM tutorial_certificates LIMIT 10');
console.log(JSON.stringify(tuts, null, 2));

await db.end();
