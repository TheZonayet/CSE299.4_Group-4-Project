import { connectDB, getDB } from './db-mysql.js';
import { randomUUID } from 'crypto';

async function seed() {
  await connectDB();
  const pool = getDB();
  console.log('Seeding MySQL sample data...');

  try {
    // Users
    const users = [
      { id: 'edu-001', role: 'EDUCATION', email: 'admin@dhakacollege.edu', password_hash: '$2a$10$YourHashedPasswordHere', verification_credits: 100 },
      { id: 'med-001', role: 'MEDICINE', email: 'admin@squarepharma.com', password_hash: '$2a$10$YourHashedPasswordHere', verification_credits: 100 },
      { id: 'tut-001', role: 'TUTORIALS', email: 'admin@codecourse.com', password_hash: '$2a$10$YourHashedPasswordHere', verification_credits: 100 },
      { id: 'per-001', role: 'PERSONAL', email: 'user@example.com', password_hash: '$2a$10$YourHashedPasswordHere', verification_credits: 100 }
    ];

    for (const u of users) {
      await pool.execute(
        'INSERT IGNORE INTO users (id, role, email, password_hash, verification_credits) VALUES (?, ?, ?, ?, ?)',
        [u.id, u.role, u.email, u.password_hash, u.verification_credits]
      );
    }

    // Educational profile
    await pool.execute(
      'INSERT IGNORE INTO educational_profiles (user_id, institute_id, institute_name, eiin_number, official_email, official_phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['edu-001', 'INST-001', 'Dhaka College', '123456', 'admin@dhakacollege.edu', '+880123456789']
    );

    // Educational certificate
    await pool.execute(
      'INSERT IGNORE INTO educational_certificates (id, roll_number, id_number, institute_id, institute_name, eiin_number, student_name, degree, cgpa, passing_year, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['cert-001', '2020001', 'ID-2020001', 'INST-001', 'Dhaka College', '123456', 'John Doe', 'Bachelor of Science', '3.75', '2024', 'Computer Science']
    );

    // Medicine profile
    await pool.execute(
      'INSERT IGNORE INTO medicine_profiles (user_id, company_id, company_name, govt_license_number, official_email, official_phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['med-001', 'MED-COMP-001', 'Square Pharma', 'LIC-12345', 'admin@squarepharma.com', '+880198765432']
    );

    // Medicine
    await pool.execute(
      'INSERT IGNORE INTO medicines (id, medicine_code, medicine_name, power, manufacturer, batch_number, expiry_date, price, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['med-001', 'NAPA-500', 'Napa', '500mg', 'Square Pharma', 'BATCH-2024-001', '2026-12-31', 2.50, 'Paracetamol 500mg tablet for fever and pain relief']
    );

    // Tutorial profile
    await pool.execute(
      'INSERT IGNORE INTO tutorial_profiles (user_id, institute_id, institute_name, govt_license_number, official_email, official_phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['tut-001', 'TUT-001', 'Code Course Academy', 'TUT-LIC-001', 'admin@codecourse.com', '+880187654321']
    );

    // Tutorial certificate
    await pool.execute(
      'INSERT IGNORE INTO tutorial_certificates (id, certificate_id, institute_id, institute_name, student_name, course_name, completion_date, duration, grade, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['tut-cert-001', 'CERT-TUT-001', 'TUT-001', 'Code Course Academy', 'Jane Smith', 'Full Stack Web Development', '2024-11-30', '6 months', 'A+', 'HTML,CSS,JavaScript,React,Node.js,MongoDB']
    );

    // Product
    await pool.execute(
      'INSERT IGNORE INTO products (id, product_code, product_name, manufacturer, batch_number, manufacturing_date, expiry_date, description, qr_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), 'PRD-001', 'Sample Product', 'Product Corp', 'PRD-BATCH-001', '2024-01-01', '2026-12-31', 'Demo product', 'QR-PRD-001']
    );

    // Verification history examples
    await pool.execute(
      'INSERT INTO verification_history (user_id, verification_type, reference_id, status) VALUES (?, ?, ?, ?)',
      ['edu-001', 'EDUCATION', 'cert-001', 'SUCCESS']
    );
    await pool.execute(
      'INSERT INTO verification_history (user_id, verification_type, reference_id, status) VALUES (?, ?, ?, ?)',
      ['med-001', 'MEDICINE', 'NAPA-500', 'SUCCESS']
    );

    console.log('✅ Seed completed');
  } catch (e) {
    console.error('❌ Seed error:', e.message);
    process.exitCode = 1;
  }
}

seed();
