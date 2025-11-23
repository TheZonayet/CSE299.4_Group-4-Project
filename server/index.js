// DB connection functions moved to db.js to avoid circular dependency
import { connectDB, getDB } from './db.js';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import educationRoutes from './routes/educationRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import tutorialRoutes from './routes/tutorialRoutes.js';
import productRoutes from './routes/productRoutes.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'asure';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

// uri/dbName retained for potential logging only

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database connection
await connectDB();

function wrapAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, role, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/ping', (req, res) => res.send('pong'));

// Mount modular domain routes (protected)
app.use('/api/education', authMiddleware, educationRoutes);
app.use('/api/medicine', authMiddleware, medicineRoutes);
app.use('/api/tutorial', authMiddleware, tutorialRoutes);
app.use('/api/product', authMiddleware, productRoutes);

// Helper: required fields per role (excluding password & confirmPassword which are universal)
const ROLE_FIELDS = {
  EDUCATION: ['instituteName', 'officialPhone', 'eiinNumber', 'officialEmail'],
  PERSONAL: ['email'],
  TUTORIALS: ['instituteName', 'officialPhone', 'govtLicenseNumber', 'officialEmail'],
  MEDICINE: ['companyName', 'officialPhone', 'govtLicenseNumber', 'officialEmail']
};

function normalizeRole(role) {
  return (role || '').trim().toUpperCase();
}

function extractEmail(role, body) {
  const r = normalizeRole(role);
  if (r === 'PERSONAL') return body.email;
  return body.officialEmail; // other roles
}

app.post('/api/register', wrapAsync(async (req, res) => {
  const rawRole = req.body.role;
  const role = normalizeRole(rawRole);
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (!role || !password || !confirmPassword) {
    return res.status(400).json({ error: 'role, password and confirmPassword are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  if (!ROLE_FIELDS[role]) {
    return res.status(400).json({ error: 'Unsupported role' });
  }

  // Validate role-specific fields
  const missing = ROLE_FIELDS[role].filter(f => !req.body[f]);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const email = extractEmail(role, req.body);
  if (!email) {
    return res.status(400).json({ error: 'Email field is required for this role' });
  }

  const db = getDB();
  const usersCollection = db.collection('users');

  const existingUser = await usersCollection.findOne({ 'auth.email': email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const id = randomUUID();

  const profile = ROLE_FIELDS[role].reduce((acc, field) => {
    acc[field] = req.body[field];
    return acc;
  }, {});

  const newUser = {
    id,
    role,
    auth: { email, passwordHash },
    profile,
    verificationCredits: 100,
    createdAt: new Date()
  };
  await usersCollection.insertOne(newUser);

  // After registration, client should redirect to login page
  return res.json({ user: { id, role, email } }); // no token on register
}));

app.post('/api/login', wrapAsync(async (req, res) => {
  const rawRole = req.body.role;
  const role = normalizeRole(rawRole);
  const password = req.body.password;
  if (!role || !password) {
    return res.status(400).json({ error: 'role and password are required' });
  }
  if (!ROLE_FIELDS[role]) {
    return res.status(400).json({ error: 'Unsupported role' });
  }

  const email = extractEmail(role, req.body);
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = getDB();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ 'auth.email': email });
  if (!user || user.role !== role) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.auth.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);
  return res.json({ user: { id: user.id, role: user.role, email: user.auth.email }, token });
}));

// Protected sample route (will expand later for profile & verification)
app.get('/api/me', authMiddleware, wrapAsync(async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ id: req.user.sub }, { projection: { auth: 0 } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
}));

// Profile endpoints
app.get('/api/profile', authMiddleware, wrapAsync(async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ id: req.user.sub }, { projection: { 'auth.passwordHash': 0 } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
}));

app.put('/api/profile', authMiddleware, wrapAsync(async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection('users');
  
  const user = await usersCollection.findOne({ id: req.user.sub });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const allowedFields = ROLE_FIELDS[user.role] || [];
  const updates = {};
  
  // Only update allowed profile fields for the user's role
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[`profile.${field}`] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  await usersCollection.updateOne(
    { id: req.user.sub },
    { $set: updates }
  );

  const updatedUser = await usersCollection.findOne({ id: req.user.sub }, { projection: { 'auth.passwordHash': 0 } });
  return res.json({ user: updatedUser });
}));

// Verification endpoints
app.post('/api/verify', authMiddleware, wrapAsync(async (req, res) => {
  const { type, qrCode, metadata } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Verification type is required' });
  }

  const db = getDB();
  const usersCollection = db.collection('users');
  const verificationsCollection = db.collection('verifications');

  const user = await usersCollection.findOne({ id: req.user.sub });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.verificationCredits <= 0) {
    return res.status(403).json({ error: 'Insufficient verification credits' });
  }

  const verificationId = randomUUID();
  const verification = {
    id: verificationId,
    userId: req.user.sub,
    type,
    qrCode: qrCode || null,
    metadata: metadata || {},
    status: 'verified',
    verifiedAt: new Date()
  };

  await verificationsCollection.insertOne(verification);
  await usersCollection.updateOne(
    { id: req.user.sub },
    { $inc: { verificationCredits: -1 } }
  );

  return res.json({ verification });
}));

app.get('/api/verification-history', authMiddleware, wrapAsync(async (req, res) => {
  const db = getDB();
  const verificationsCollection = db.collection('verifications');
  
  const verifications = await verificationsCollection
    .find({ userId: req.user.sub })
    .sort({ verifiedAt: -1 })
    .limit(100)
    .toArray();

  return res.json({ verifications });
}));

app.get('/api/verification-limits', authMiddleware, wrapAsync(async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection('users');
  
  const user = await usersCollection.findOne({ id: req.user.sub }, { projection: { verificationCredits: 1 } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json({ credits: user.verificationCredits || 0 });
}));

// Educational Certificate Verification
app.post('/api/verify-education', authMiddleware, wrapAsync(async (req, res) => {
  const { rollNumber, instituteId } = req.body;
  
  if (!rollNumber || !instituteId) {
    return res.status(400).json({ error: 'Roll number and institute ID are required' });
  }

  const db = getDB();
  const certificatesCollection = db.collection('educational_certificates');
  
  // Mock verification - in production, search database
  const certificate = await certificatesCollection.findOne({ rollNumber, instituteId });
  
  if (certificate) {
    return res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: {
        instituteName: certificate.instituteName || 'Sample Institute',
        studentName: certificate.studentName || 'John Doe',
        degree: certificate.degree || 'Bachelor of Science',
        cgpa: certificate.cgpa || '3.75',
        passingYear: certificate.passingYear || '2023',
        rollNumber: certificate.rollNumber,
        isAuthentic: true
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Certificate not found in database',
      data: { isAuthentic: false }
    });
  }
}));

app.post('/api/verify-education-image', authMiddleware, wrapAsync(async (req, res) => {
  const { imageData } = req.body;
  
  if (!imageData) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  // Mock AI OCR response - in production, integrate with OCR API
  const mockExtractedData = {
    instituteName: 'AI Detected Institute',
    studentName: 'AI Detected Name',
    degree: 'Bachelor of Engineering',
    cgpa: '3.85',
    passingYear: '2024',
    rollNumber: 'AI-' + Math.floor(Math.random() * 10000),
    isAuthentic: true
  };

  return res.json({
    success: true,
    message: 'Certificate analyzed successfully via AI',
    data: mockExtractedData
  });
}));

// Medicine Verification
app.post('/api/verify-medicine', authMiddleware, wrapAsync(async (req, res) => {
  const { medicineName, medicineCode } = req.body;
  
  if (!medicineName && !medicineCode) {
    return res.status(400).json({ error: 'Medicine name or code is required' });
  }

  const db = getDB();
  const medicinesCollection = db.collection('medicines');
  
  const query = medicineCode 
    ? { code: medicineCode }
    : { name: new RegExp(medicineName, 'i') };
  
  const medicine = await medicinesCollection.findOne(query);
  
  if (medicine) {
    return res.json({
      success: true,
      message: 'Medicine verified successfully',
      data: {
        name: medicine.name || 'Sample Medicine',
        manufacturer: medicine.manufacturer || 'Pharma Corp',
        batchNumber: medicine.batchNumber || 'BATCH-2024-001',
        expiryDate: medicine.expiryDate || '2026-12-31',
        isAuthentic: true,
        price: medicine.price || '$25.00'
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Medicine not found in database',
      data: { isAuthentic: false }
    });
  }
}));

app.post('/api/verify-medicine-image', authMiddleware, wrapAsync(async (req, res) => {
  const { imageData } = req.body;
  
  if (!imageData) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  // Mock AI response
  const mockMedicine = {
    name: 'AI Detected Medicine',
    manufacturer: 'AI Pharma',
    batchNumber: 'AI-BATCH-' + Math.floor(Math.random() * 1000),
    expiryDate: '2026-06-30',
    isAuthentic: true,
    price: '$' + (Math.random() * 50 + 10).toFixed(2)
  };

  return res.json({
    success: true,
    message: 'Medicine analyzed successfully via AI',
    data: mockMedicine
  });
}));

app.post('/api/medicine-suggestion', authMiddleware, wrapAsync(async (req, res) => {
  const { medicineName, patientData } = req.body;
  
  if (!medicineName || !patientData) {
    return res.status(400).json({ error: 'Medicine name and patient data are required' });
  }

  // Mock AI suggestion based on patient data
  const mockSuggestion = {
    recommendedDosage: `Based on age ${patientData.age} and weight ${patientData.weight}kg: Take 2 tablets daily`,
    suitability: 'Suitable for patient profile',
    warnings: patientData.allergies ? `Warning: Patient has allergies to ${patientData.allergies}` : 'No known conflicts',
    alternatives: [
      { name: 'Alternative Medicine A', price: '$20.00', availability: 'In Stock' },
      { name: 'Alternative Medicine B', price: '$18.50', availability: 'In Stock' }
    ]
  };

  return res.json({
    success: true,
    message: 'AI suggestion generated successfully',
    data: mockSuggestion
  });
}));

// Product Verification
app.post('/api/verify-product', authMiddleware, wrapAsync(async (req, res) => {
  const { barcode, imageData } = req.body;
  
  if (!barcode && !imageData) {
    return res.status(400).json({ error: 'Barcode or image data is required' });
  }

  const db = getDB();
  const productsCollection = db.collection('products');
  
  let product;
  if (barcode) {
    product = await productsCollection.findOne({ barcode });
  }

  if (product) {
    return res.json({
      success: true,
      message: 'Product verified successfully',
      data: {
        name: product.name || 'Sample Product',
        manufacturer: product.manufacturer || 'Product Corp',
        barcode: product.barcode,
        isAuthentic: true,
        price: product.price || '$49.99',
        similarProducts: [
          { name: 'Similar Product A', price: '$45.00', rating: 4.5 },
          { name: 'Similar Product B', price: '$52.00', rating: 4.7 }
        ]
      }
    });
  } else {
    // Mock web search result
    return res.json({
      success: true,
      message: 'Product found via web search',
      data: {
        name: 'Product from Web',
        manufacturer: 'Various Sellers',
        barcode: barcode || 'UNKNOWN',
        isAuthentic: false,
        price: '$' + (Math.random() * 100 + 20).toFixed(2),
        similarProducts: [
          { name: 'Web Similar A', price: '$35.00', rating: 4.2 },
          { name: 'Web Similar B', price: '$40.00', rating: 4.4 }
        ]
      }
    });
  }
}));

// Tutorial Certificate Verification
app.post('/api/verify-tutorial', authMiddleware, wrapAsync(async (req, res) => {
  const { certificateId, imageData } = req.body;
  
  if (!certificateId && !imageData) {
    return res.status(400).json({ error: 'Certificate ID or image data is required' });
  }

  const db = getDB();
  const tutorialCertificatesCollection = db.collection('tutorial_certificates');
  
  let certificate;
  if (certificateId) {
    certificate = await tutorialCertificatesCollection.findOne({ certificateId });
  }

  if (certificate || imageData) {
    const extractedSkills = imageData 
      ? ['JavaScript', 'React', 'Node.js', 'MongoDB'] // Mock AI extraction
      : (certificate?.skills || ['Programming', 'Web Development']);

    return res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: {
        instituteName: certificate?.instituteName || 'AI Tutorial Institute',
        studentName: certificate?.studentName || 'AI Detected Student',
        courseName: certificate?.courseName || 'Full Stack Development',
        completionDate: certificate?.completionDate || '2024-11-15',
        certificateId: certificateId || 'AI-CERT-' + Math.floor(Math.random() * 10000),
        isAuthentic: certificate ? true : false,
        skills: extractedSkills,
        youtubeRecommendations: [
          {
            title: `${extractedSkills[0]} Tutorial for Beginners`,
            channel: 'Programming Academy',
            url: `https://youtube.com/watch?v=demo${Math.floor(Math.random() * 1000)}`
          },
          {
            title: `Advanced ${extractedSkills[1] || 'Programming'} Course`,
            channel: 'Tech Tutorials',
            url: `https://youtube.com/watch?v=demo${Math.floor(Math.random() * 1000)}`
          }
        ]
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Certificate not found in database',
      data: { isAuthentic: false }
    });
  }
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Express server listening on http://localhost:${port}`));
