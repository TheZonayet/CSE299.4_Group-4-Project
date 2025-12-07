// DB connection functions moved to db-mysql.js to avoid circular dependency
import { connectDB, getDB } from './db-mysql.js';
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
import aiRoutes from './routes/aiRoutes.js';
import * as userHelpers from './helpers/userHelpers.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'asure';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

// uri/dbName retained for potential logging only

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/api/ai', authMiddleware, aiRoutes);

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

  const missing = ROLE_FIELDS[role].filter(f => !req.body[f]);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const email = extractEmail(role, req.body);
  if (!email) {
    return res.status(400).json({ error: 'Email field is required for this role' });
  }

  const existingUser = await userHelpers.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const id = randomUUID();

  const profileData = ROLE_FIELDS[role].reduce((acc, field) => {
    acc[field] = req.body[field];
    return acc;
  }, {});

  const newUser = await userHelpers.createUser({
    id,
    role,
    email,
    passwordHash,
    profileData
  });

  return res.json({ user: newUser });
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

  const user = await userHelpers.findUserByEmail(email);
  if (!user || user.role !== role) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, role: user.role });
  return res.json({ user: { id: user.id, role: user.role, email: user.email }, token });
}));

// Protected sample route (will expand later for profile & verification)
app.get('/api/me', authMiddleware, wrapAsync(async (req, res) => {
  const user = await userHelpers.getUserWithProfile(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
}));

// Profile endpoints
app.get('/api/profile', authMiddleware, wrapAsync(async (req, res) => {
  const user = await userHelpers.getUserWithProfile(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
}));

app.put('/api/profile', authMiddleware, wrapAsync(async (req, res) => {
  const user = await userHelpers.findUserById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const allowedFields = ROLE_FIELDS[user.role] || [];
  const updates = {};
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  // Allow profile picture update
  if (req.body.profilePicture !== undefined) {
    updates.profilePicture = req.body.profilePicture;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const updatedUser = await userHelpers.updateUserProfile(req.user.sub, updates);
  return res.json({ user: updatedUser });
}));

// Verification endpoints
app.post('/api/verify', authMiddleware, wrapAsync(async (req, res) => {
  const { type, qrCode, metadata } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Verification type is required' });
  }

  const db = getDB();

  // Pull latest credit state
  const [users] = await db.execute(
    `SELECT verification_credits, monthly_credits_used, last_credit_reset
     FROM users WHERE id = ?`,
    [req.user.sub]
  );
  if (!users.length) return res.status(404).json({ error: 'User not found' });

  const user = users[0];
  const monthlyFreeCredits = 100;
  const now = new Date();
  const lastReset = user.last_credit_reset ? new Date(user.last_credit_reset) : null;
  const needsReset = !lastReset || (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear());

  if (needsReset) {
    await db.execute(
      `UPDATE users SET monthly_credits_used = 0, last_credit_reset = NOW() WHERE id = ?`,
      [req.user.sub]
    );
    user.monthly_credits_used = 0;
  }

  const creditsUsedThisMonth = user.monthly_credits_used || 0;
  const freeCreditsRemaining = Math.max(0, monthlyFreeCredits - creditsUsedThisMonth);
  const purchasedCredits = user.verification_credits || 0;
  const totalAvailable = freeCreditsRemaining + purchasedCredits;

  if (totalAvailable <= 0) {
    return res.status(403).json({ error: 'Insufficient verification credits', creditsRemaining: 0 });
  }

  // Deduct: prefer free credits first
  if (freeCreditsRemaining > 0) {
    await db.execute(
      `UPDATE users SET monthly_credits_used = monthly_credits_used + 1 WHERE id = ?`,
      [req.user.sub]
    );
  } else {
    await db.execute(
      `UPDATE users SET verification_credits = verification_credits - 1 WHERE id = ?`,
      [req.user.sub]
    );
  }

  await userHelpers.addVerificationHistory({
    userId: req.user.sub,
    type: type.toUpperCase(),
    referenceId: qrCode || JSON.stringify(metadata),
    status: 'SUCCESS'
  });

  await db.execute(
    `INSERT INTO credit_usage (user_id, credits_added, credits_removed, balance_after, description)
     VALUES (?, 0, 1,
       (SELECT verification_credits + GREATEST(0, 100 - monthly_credits_used) FROM users WHERE id = ?),
       ?)`,
    [req.user.sub, req.user.sub, `${type.toUpperCase()} verification`]
  );

  return res.json({
    verification: {
      id: randomUUID(),
      userId: req.user.sub,
      type,
      status: 'verified',
      creditsRemaining: totalAvailable - 1
    }
  });
}));

app.get('/api/verification-history', authMiddleware, wrapAsync(async (req, res) => {
  const verifications = await userHelpers.getVerificationHistory(req.user.sub, 100);
  return res.json({ verifications });
}));

app.get('/api/verification-limits', authMiddleware, wrapAsync(async (req, res) => {
  const credits = await userHelpers.getVerificationCredits(req.user.sub);
  return res.json({ credits });
}));

// Profile picture upload
app.put('/api/profile/upload-picture', authMiddleware, wrapAsync(async (req, res) => {
  const { profilePicture } = req.body;
  if (!profilePicture) return res.status(400).json({ error: 'Profile picture is required' });

  const sizeMB = (profilePicture.length * 3) / 4 / (1024 * 1024);
  if (sizeMB > 5) return res.status(400).json({ error: 'Image size exceeds 5MB' });

  const db = getDB();
  const user = await userHelpers.findUserById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const profileTable = {
    EDUCATION: 'educational_profiles',
    MEDICINE: 'medicine_profiles',
    TUTORIALS: 'tutorial_profiles'
  }[user.role];

  if (!profileTable) return res.status(400).json({ error: 'Profile table not found for role' });

  await db.execute(
    `UPDATE ${profileTable} SET profile_picture = ?, updated_at = NOW() WHERE user_id = ?`,
    [profilePicture, req.user.sub]
  );

  return res.json({ success: true, message: 'Profile picture updated' });
}));

// Get credits balance with monthly reset
app.get('/api/credits/balance', authMiddleware, wrapAsync(async (req, res) => {
  const db = getDB();
  const [users] = await db.execute(
    `SELECT verification_credits, monthly_credits_used, last_credit_reset, total_credits_purchased
     FROM users WHERE id = ?`,
    [req.user.sub]
  );
  if (!users.length) return res.status(404).json({ error: 'User not found' });

  const user = users[0];
  const monthlyFreeCredits = 100;
  const now = new Date();
  const lastReset = user.last_credit_reset ? new Date(user.last_credit_reset) : null;
  const needsReset = !lastReset || (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear());

  if (needsReset) {
    await db.execute(
      `UPDATE users SET monthly_credits_used = 0, last_credit_reset = NOW() WHERE id = ?`,
      [req.user.sub]
    );
    user.monthly_credits_used = 0;
  }

  const freeRemaining = Math.max(0, monthlyFreeCredits - (user.monthly_credits_used || 0));
  const purchased = user.verification_credits || 0;

  return res.json({
    monthlyFree: monthlyFreeCredits,
    monthlyUsed: user.monthly_credits_used || 0,
    freeRemaining,
    purchased,
    totalPurchased: user.total_credits_purchased || 0,
    totalAvailable: freeRemaining + purchased
  });
}));

// List credit packages
app.get('/api/credits/packages', wrapAsync(async (req, res) => {
  const db = getDB();
  const [packages] = await db.execute(
    `SELECT id, name, credits, price_bdt, description, is_recommended
     FROM credit_packages
     WHERE is_active = TRUE
     ORDER BY credits ASC`
  );
  return res.json({ packages });
}));

// Create payment intent
app.post('/api/payments/create', authMiddleware, wrapAsync(async (req, res) => {
  const { packageId, paymentMethod } = req.body;
  const validMethods = ['BKASH', 'VISA', 'MASTERCARD', 'BANK_TRANSFER'];
  if (!packageId || !paymentMethod) return res.status(400).json({ error: 'Package ID and payment method are required' });
  if (!validMethods.includes(paymentMethod)) return res.status(400).json({ error: 'Invalid payment method' });

  const db = getDB();
  const [packages] = await db.execute(
    'SELECT * FROM credit_packages WHERE id = ? AND is_active = TRUE',
    [packageId]
  );
  if (!packages.length) return res.status(404).json({ error: 'Package not found' });

  const pkg = packages[0];
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

  const [result] = await db.execute(
    `INSERT INTO payments (user_id, amount, credits_purchased, payment_method, transaction_id, payment_status)
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [req.user.sub, pkg.price_bdt, pkg.credits, paymentMethod, transactionId]
  );

  return res.json({
    paymentId: result.insertId,
    transactionId,
    amount: pkg.price_bdt,
    credits: pkg.credits,
    paymentMethod,
    status: 'PENDING'
  });
}));

// Verify/complete payment (mock webhook/user confirmation)
app.post('/api/payments/verify', authMiddleware, wrapAsync(async (req, res) => {
  const { transactionId, gatewayTransactionId } = req.body;
  if (!transactionId) return res.status(400).json({ error: 'Transaction ID is required' });

  const db = getDB();
  const [payments] = await db.execute(
    'SELECT * FROM payments WHERE transaction_id = ? AND user_id = ?',
    [transactionId, req.user.sub]
  );
  if (!payments.length) return res.status(404).json({ error: 'Payment not found' });

  const payment = payments[0];
  if (payment.payment_status === 'COMPLETED') return res.status(400).json({ error: 'Payment already completed' });

  await db.execute(
    `UPDATE payments
     SET payment_status = 'COMPLETED', gateway_transaction_id = ?, completed_at = NOW()
     WHERE id = ?`,
    [gatewayTransactionId || transactionId, payment.id]
  );

  await db.execute(
    `UPDATE users
     SET verification_credits = verification_credits + ?,
         total_credits_purchased = total_credits_purchased + ?
     WHERE id = ?`,
    [payment.credits_purchased, payment.credits_purchased, payment.user_id]
  );

  await db.execute(
    `INSERT INTO credit_usage (user_id, credits_added, credits_removed, balance_after, description)
     VALUES (?, ?, 0,
       (SELECT verification_credits + GREATEST(0, 100 - monthly_credits_used) FROM users WHERE id = ?),
       ?)`,
    [payment.user_id, payment.credits_purchased, payment.user_id, `Purchased ${payment.credits_purchased} credits via ${payment.payment_method}`]
  );

  return res.json({ success: true, message: 'Payment verified', creditsAdded: payment.credits_purchased });
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Express server listening on http://localhost:${port}`));
