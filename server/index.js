import { MongoClient } from 'mongodb';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'asure';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

let client;
let db;

export async function connectDB() {
  if (db) return db;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    // Create indexes (email unique – role-specific fields stored under profile)
    await db.collection('users').createIndex({ 'auth.email': 1 }, { unique: true });
    
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

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

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Express server listening on http://localhost:${port}`));
