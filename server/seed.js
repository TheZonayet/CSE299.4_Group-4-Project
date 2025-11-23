import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'asure';

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);

    // Seed Educational Institutes
    const educationalInstitutes = db.collection('educational_institutes');
    await educationalInstitutes.deleteMany({});
    await educationalInstitutes.insertMany([
      {
        instituteId: 'INST-001',
        instituteName: 'National University',
        eiinNumber: 'EIIN-123456',
        address: '123 University Ave, Dhaka',
        officialEmail: 'info@nationaluni.edu',
        officialPhone: '+880-123-456789',
        establishedYear: '1992',
        accreditation: 'UGC Approved',
        createdAt: new Date()
      },
      {
        instituteId: 'INST-002',
        instituteName: 'Tech Institute',
        eiinNumber: 'EIIN-789012',
        address: '456 Tech Road, Chittagong',
        officialEmail: 'contact@techinstitute.edu',
        officialPhone: '+880-987-654321',
        establishedYear: '2005',
        accreditation: 'UGC Approved',
        createdAt: new Date()
      }
    ]);
    console.log('✅ Seeded educational institutes');

    // Seed Educational Certificates
    const educationalCertificates = db.collection('educational_certificates');
    await educationalCertificates.deleteMany({}); // Clear existing
    await educationalCertificates.insertMany([
      {
        rollNumber: '2020001',
        instituteId: 'INST-001',
        instituteName: 'National University',
        studentName: 'John Smith',
        degree: 'Bachelor of Science in Computer Science',
        cgpa: '3.85',
        passingYear: '2024',
        createdAt: new Date()
      },
      {
        rollNumber: '2020002',
        instituteId: 'INST-001',
        instituteName: 'National University',
        studentName: 'Jane Doe',
        degree: 'Bachelor of Engineering',
        cgpa: '3.92',
        passingYear: '2024',
        createdAt: new Date()
      },
      {
        rollNumber: '2019050',
        instituteId: 'INST-002',
        instituteName: 'Tech Institute',
        studentName: 'Alice Johnson',
        degree: 'Master of Technology',
        cgpa: '3.75',
        passingYear: '2023',
        createdAt: new Date()
      }
    ]);
    console.log('✅ Seeded educational certificates');

    // Seed Medicines
    const medicines = db.collection('medicines');
    await medicines.deleteMany({});
    await medicines.insertMany([
      {
        name: 'Paracetamol 500mg',
        code: 'MED-001',
        manufacturer: 'PharmaCorp International',
        batchNumber: 'BATCH-2024-1001',
        expiryDate: '2026-12-31',
        price: '$5.99',
        description: 'Pain reliever and fever reducer',
        createdAt: new Date()
      },
      {
        name: 'Amoxicillin 250mg',
        code: 'MED-002',
        manufacturer: 'HealthMed Solutions',
        batchNumber: 'BATCH-2024-2002',
        expiryDate: '2025-08-15',
        price: '$12.50',
        description: 'Antibiotic for bacterial infections',
        createdAt: new Date()
      },
      {
        name: 'Ibuprofen 400mg',
        code: 'MED-003',
        manufacturer: 'MediCare Plus',
        batchNumber: 'BATCH-2024-3003',
        expiryDate: '2027-03-20',
        price: '$8.75',
        description: 'Anti-inflammatory and pain relief',
        createdAt: new Date()
      },
      {
        name: 'Vitamin D3 1000IU',
        code: 'MED-004',
        manufacturer: 'WellnessLab',
        batchNumber: 'BATCH-2024-4004',
        expiryDate: '2026-06-30',
        price: '$15.00',
        description: 'Vitamin supplement for bone health',
        createdAt: new Date()
      }
    ]);
    console.log('✅ Seeded medicines');

    // Seed Products
    const products = db.collection('products');
    await products.deleteMany({});
    await products.insertMany([
      {
        name: 'Wireless Bluetooth Headphones',
        barcode: '8901234567890',
        manufacturer: 'AudioTech Inc.',
        price: '$79.99',
        category: 'Electronics',
        description: 'Premium wireless headphones with noise cancellation',
        createdAt: new Date()
      },
      {
        name: 'Organic Green Tea',
        barcode: '8901234567891',
        manufacturer: 'Nature\'s Best',
        price: '$12.99',
        category: 'Food & Beverages',
        description: '100% organic premium green tea',
        createdAt: new Date()
      },
      {
        name: 'Smart Fitness Watch',
        barcode: '8901234567892',
        manufacturer: 'FitTech Corp',
        price: '$149.99',
        category: 'Wearables',
        description: 'Advanced fitness tracking smartwatch',
        createdAt: new Date()
      },
      {
        name: 'Eco-Friendly Water Bottle',
        barcode: '8901234567893',
        manufacturer: 'GreenLife Products',
        price: '$24.99',
        category: 'Lifestyle',
        description: 'Reusable stainless steel water bottle',
        createdAt: new Date()
      }
    ]);
    console.log('✅ Seeded products');

    // Seed Tutorial Institutes
    const tutorialInstitutes = db.collection('tutorial_institutes');
    await tutorialInstitutes.deleteMany({});
    await tutorialInstitutes.insertMany([
      {
        instituteId: 'TUT-INST-001',
        instituteName: 'CodeAcademy Pro',
        govtLicenseNumber: 'LIC-CODE-2020-001',
        address: '789 Learning Street, Dhaka',
        officialEmail: 'admin@codeacademy.pro',
        officialPhone: '+880-111-222333',
        establishedYear: '2018',
        specialization: 'Web Development, Programming',
        accreditation: 'Govt. Registered',
        createdAt: new Date()
      },
      {
        instituteId: 'TUT-INST-002',
        instituteName: 'Data Science Hub',
        govtLicenseNumber: 'LIC-DATA-2019-002',
        address: '321 Data Avenue, Dhaka',
        officialEmail: 'info@datasciencehub.com',
        officialPhone: '+880-444-555666',
        establishedYear: '2019',
        specialization: 'Data Science, AI, Machine Learning',
        accreditation: 'Govt. Registered',
        createdAt: new Date()
      },
      {
        instituteId: 'TUT-INST-003',
        instituteName: 'Design Masters',
        govtLicenseNumber: 'LIC-DESIGN-2021-003',
        address: '654 Creative Plaza, Dhaka',
        officialEmail: 'contact@designmasters.io',
        officialPhone: '+880-777-888999',
        establishedYear: '2021',
        specialization: 'UI/UX Design, Graphic Design',
        accreditation: 'Govt. Registered',
        createdAt: new Date()
      }
    ]);
    console.log('✅ Seeded tutorial institutes');

    // Seed Tutorial Certificates
    const tutorialCertificates = db.collection('tutorial_certificates');
    await tutorialCertificates.deleteMany({});
    await tutorialCertificates.insertMany([
      {
        certificateId: 'CERT-2024-001',
        instituteId: 'TUT-INST-001',
        instituteName: 'CodeAcademy Pro',
        studentName: 'Michael Chen',
        courseName: 'Full Stack Web Development',
        completionDate: '2024-10-15',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
        duration: '6 months',
        grade: 'A+',
        createdAt: new Date()
      },
      {
        certificateId: 'CERT-2024-002',
        instituteId: 'TUT-INST-002',
        instituteName: 'Data Science Hub',
        studentName: 'Sarah Williams',
        courseName: 'Python for Data Science',
        completionDate: '2024-09-20',
        skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'TensorFlow'],
        duration: '4 months',
        grade: 'A',
        createdAt: new Date()
      },
      {
        certificateId: 'CERT-2024-003',
        instituteId: 'TUT-INST-003',
        instituteName: 'Design Masters',
        studentName: 'Emma Davis',
        courseName: 'UI/UX Design Fundamentals',
        completionDate: '2024-11-01',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
        duration: '3 months',
        grade: 'A+',
        createdAt: new Date()
      }
    ]);
    console.log('✅ Seeded tutorial certificates');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Educational Institutes: ${await educationalInstitutes.countDocuments()}`);
    console.log(`   - Educational Certificates: ${await educationalCertificates.countDocuments()}`);
    console.log(`   - Medicines: ${await medicines.countDocuments()}`);
    console.log(`   - Products: ${await products.countDocuments()}`);
    console.log(`   - Tutorial Institutes: ${await tutorialInstitutes.countDocuments()}`);
    console.log(`   - Tutorial Certificates: ${await tutorialCertificates.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

seedDatabase();
