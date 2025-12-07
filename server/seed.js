import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'asure_verification_db'
};

async function seedDatabase() {
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // Clear tables in order (respecting foreign keys)
    await conn.execute('DELETE FROM verification_history');
    await conn.execute('DELETE FROM tutorial_certificates');
    await conn.execute('DELETE FROM tutorial_profiles');
    await conn.execute('DELETE FROM medicines');
    await conn.execute('DELETE FROM medicine_profiles');
    await conn.execute('DELETE FROM educational_certificates');
    await conn.execute('DELETE FROM educational_profiles');
    await conn.execute('DELETE FROM products');
    await conn.execute('DELETE FROM users');

    // Users
    await conn.execute(
      'INSERT INTO users (id, role, email, password_hash, verification_credits) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
      [
        'edu-001','EDUCATION','admin@dhakacollege.edu','$2a$10$YourHashedPasswordHere',100,
        'med-001','MEDICINE','admin@squarepharma.com','$2a$10$YourHashedPasswordHere',100,
        'tut-001','TUTORIALS','admin@codecourse.com','$2a$10$YourHashedPasswordHere',100,
        'per-001','PERSONAL','user@example.com','$2a$10$YourHashedPasswordHere',100
      ]
    );

    // Educational profile
    await conn.execute(
      'INSERT INTO educational_profiles (user_id, institute_id, institute_name, eiin_number, official_email, official_phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['edu-001','INST-001','Dhaka College','123456','admin@dhakacollege.edu','+880123456789']
    );

    // Educational certificates
    await conn.execute(
      'INSERT INTO educational_certificates (id, roll_number, id_number, institute_id, institute_name, eiin_number, student_name, degree, cgpa, passing_year, department) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      ['cert-001','2020001','ID-2020001','INST-001','Dhaka College','123456','John Doe','Bachelor of Science','3.75','2024','Computer Science']
    );
    await conn.execute(
      'INSERT INTO educational_certificates (id, roll_number, id_number, institute_id, institute_name, eiin_number, student_name, degree, cgpa, passing_year, department) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      ['cert-002','2020002','ID-2020002','INST-001','Dhaka College','123456','Jane Doe','Bachelor of Engineering','3.92','2024','Electrical Engineering']
    );

    // Medicine profile
    await conn.execute(
      'INSERT INTO medicine_profiles (user_id, company_id, company_name, govt_license_number, official_email, official_phone) VALUES (?,?,?,?,?,?)',
      ['med-001','MED-COMP-001','Square Pharma','LIC-12345','admin@squarepharma.com','+880198765432']
    );

    // Medicines
    await conn.execute(
      'INSERT INTO medicines (id, medicine_code, medicine_name, power, manufacturer, batch_number, expiry_date, price, description) VALUES (?,?,?,?,?,?,?,?,?)',
      ['med-001','NAPA-500','Napa','500mg','Square Pharma','BATCH-2024-001','2026-12-31',2.50,'Paracetamol 500mg tablet for fever and pain relief']
    );
    await conn.execute(
      'INSERT INTO medicines (id, medicine_code, medicine_name, power, manufacturer, batch_number, expiry_date, price, description) VALUES (?,?,?,?,?,?,?,?,?)',
      ['med-002','AMOX-250','Amoxicillin','250mg','HealthMed Solutions','BATCH-2024-2002','2025-08-15',12.50,'Antibiotic for bacterial infections']
    );

    // Tutorial profile
    await conn.execute(
      'INSERT INTO tutorial_profiles (user_id, institute_id, institute_name, govt_license_number, official_email, official_phone) VALUES (?,?,?,?,?,?)',
      ['tut-001','TUT-001','Code Course Academy','TUT-LIC-001','admin@codecourse.com','+880187654321']
    );

    // Tutorial certificates
    await conn.execute(
      'INSERT INTO tutorial_certificates (id, certificate_id, institute_id, institute_name, student_name, course_name, completion_date, duration, grade, skills) VALUES (?,?,?,?,?,?,?,?,?,?)',
      ['tut-cert-001','CERT-TUT-001','TUT-001','Code Course Academy','Jane Smith','Full Stack Web Development','2024-11-30','6 months','A+','HTML,CSS,JavaScript,React,Node.js,MongoDB']
    );

    // Products
    await conn.execute(
      'INSERT INTO products (id, product_code, product_name, manufacturer, batch_number, manufacturing_date, expiry_date, description, qr_code) VALUES (?,?,?,?,?,?,?,?,?)',
      ['prod-001','8901234567890','Wireless Bluetooth Headphones','AudioTech Inc.',null,'2024-01-15',null,'Premium wireless headphones with noise cancellation',null]
    );
    await conn.execute(
      'INSERT INTO products (id, product_code, product_name, manufacturer, batch_number, manufacturing_date, expiry_date, description, qr_code) VALUES (?,?,?,?,?,?,?,?,?)',
      ['prod-002','8901234567891','Organic Green Tea','Nature\'s Best',null,'2024-02-01',null,'100% organic premium green tea',null]
    );

    console.log('\n🎉 MySQL database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding MySQL database:', error);
    process.exit(1);
  } finally {
    if (conn) {
      await conn.end();
      console.log('\n🔌 MySQL connection closed');
    }
  }
}

seedDatabase();
