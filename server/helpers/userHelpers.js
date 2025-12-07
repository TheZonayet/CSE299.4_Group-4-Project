import bcrypt from 'bcryptjs';
import { getDB } from '../db-mysql.js';

/**
 * Helper functions for user management with MySQL
 */

// Get profile table name based on role
function getProfileTableForRole(role) {
  const tables = {
    'EDUCATION': 'educational_profiles',
    'MEDICINE': 'medicine_profiles',
    'TUTORIALS': 'tutorial_profiles',
    'PERSONAL': null // Personal users don't have a separate profile table
  };
  return tables[role] || null;
}

// Get profile fields for role
function getProfileFieldsForRole(role) {
  const fields = {
    'EDUCATION': {
      institute_id: 'instituteId',
      institute_name: 'instituteName',
      eiin_number: 'eiinNumber',
      official_email: 'officialEmail',
      official_phone: 'officialPhone'
    },
    'MEDICINE': {
      company_id: 'companyId',
      company_name: 'companyName',
      govt_license_number: 'govtLicenseNumber',
      official_email: 'officialEmail',
      official_phone: 'officialPhone'
    },
    'TUTORIALS': {
      institute_id: 'instituteId',
      institute_name: 'instituteName',
      govt_license_number: 'govtLicenseNumber',
      official_email: 'officialEmail',
      official_phone: 'officialPhone'
    },
    'PERSONAL': {
      email: 'email'
    }
  };
  return fields[role] || {};
}

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  const pool = getDB();
  const [users] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return users[0] || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id) {
  const pool = getDB();
  const [users] = await pool.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return users[0] || null;
}

/**
 * Create new user with profile
 */
export async function createUser(userData) {
  const pool = getDB();
  const { id, role, email, passwordHash, profileData } = userData;
  
  // Insert user
  await pool.execute(
    'INSERT INTO users (id, role, email, password_hash, verification_credits) VALUES (?, ?, ?, ?, ?)',
    [id, role, email, passwordHash, 100]
  );
  
  // Insert profile if role requires it
  const profileTable = getProfileTableForRole(role);
  if (profileTable && profileData) {
    const fieldMapping = getProfileFieldsForRole(role);
    const dbFields = Object.keys(fieldMapping);
    const values = dbFields.map(dbField => profileData[fieldMapping[dbField]] || null);
    
    const fieldNames = ['user_id', ...dbFields].join(', ');
    const placeholders = ['?', ...dbFields.map(() => '?')].join(', ');
    const allValues = [id, ...values];

    await pool.execute(
      `INSERT INTO ${profileTable} (${fieldNames}) VALUES (${placeholders})`,
      allValues
    );
  }
  
  return { id, role, email };
}

/**
 * Get user with profile
 */
export async function getUserWithProfile(id) {
  const pool = getDB();
  
  // Get user
  const [users] = await pool.execute(
    `SELECT id, role, email, name, verification_credits, monthly_credits_used, total_credits_purchased,
            last_credit_reset, created_at, profile_picture
     FROM users WHERE id = ?`,
    [id]
  );
  
  if (users.length === 0) return null;
  
  const user = users[0];
  const profileTable = getProfileTableForRole(user.role);
  
  // Get profile if exists
  let profile = {};
  if (profileTable) {
    const [profiles] = await pool.execute(
      `SELECT *, profile_picture FROM ${profileTable} WHERE user_id = ?`,
      [id]
    );
    
    if (profiles.length > 0) {
      const dbProfile = profiles[0];
      console.log('getUserWithProfile - profile_picture from DB:', dbProfile.profile_picture ? 'EXISTS' : 'NULL');
      const fieldMapping = getProfileFieldsForRole(user.role);
      
      // Convert database fields to API fields
      Object.keys(fieldMapping).forEach(dbField => {
        const apiField = fieldMapping[dbField];
        profile[apiField] = dbProfile[dbField];
      });

      // Include profile picture if present
      if (dbProfile.profile_picture) {
        profile.profilePicture = dbProfile.profile_picture;
      }
    }
  } else if (user.role === 'PERSONAL') {
    profile = { email: user.email };
    // For PERSONAL users, include name and profile picture from users table
    if (user.name) {
      profile.name = user.name;
    }
    if (user.profile_picture) {
      profile.profilePicture = user.profile_picture;
    }
  }
  
  return {
    id: user.id,
    role: user.role,
    auth: { email: user.email },
    profile,
    verificationCredits: user.verification_credits,
    monthlyCreditsUsed: user.monthly_credits_used || 0,
    totalCreditsPurchased: user.total_credits_purchased || 0,
    createdAt: user.created_at
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(id, updates) {
  const pool = getDB();
  
  // Get user to know their role
  const user = await findUserById(id);
  if (!user) return null;
  
  const profileTable = getProfileTableForRole(user.role);
  
  // Handle PERSONAL users - update name and profile_picture in users table
  if (user.role === 'PERSONAL') {
    const personalUpdates = [];
    const personalValues = [];
    
    if (updates.name !== undefined) {
      personalUpdates.push('name = ?');
      personalValues.push(updates.name);
    }
    if (updates.profilePicture !== undefined) {
      personalUpdates.push('profile_picture = ?');
      personalValues.push(updates.profilePicture);
    }
    
    if (personalUpdates.length > 0) {
      personalValues.push(id);
      await pool.execute(
        `UPDATE users SET ${personalUpdates.join(', ')} WHERE id = ?`,
        personalValues
      );
    }
    return getUserWithProfile(id);
  }
  
  if (!profileTable) return user; // No profile table for this role
  
  // Map API fields to database fields
  const fieldMapping = getProfileFieldsForRole(user.role);
  const dbUpdates = {};
  
  Object.keys(updates).forEach(apiField => {
    const dbField = Object.keys(fieldMapping).find(
      dbF => fieldMapping[dbF] === apiField
    );
    if (dbField) {
      dbUpdates[dbField] = updates[apiField];
    }
    // profilePicture maps to profile_picture column
    if (apiField === 'profilePicture') {
      dbUpdates['profile_picture'] = updates[apiField];
      console.log('updateUserProfile - Setting profile_picture, length:', updates[apiField] ? updates[apiField].length : 0);
    }
  });
  
  if (Object.keys(dbUpdates).length === 0) return user;
  
  // Build UPDATE query
  const setClause = Object.keys(dbUpdates).map(field => `${field} = ?`).join(', ');
  const values = [...Object.values(dbUpdates), id];
  
  await pool.execute(
    `UPDATE ${profileTable} SET ${setClause} WHERE user_id = ?`,
    values
  );
  
  return getUserWithProfile(id);
}

/**
 * Decrease verification credits
 */
export async function decreaseVerificationCredits(userId) {
  const pool = getDB();
  await pool.execute(
    'UPDATE users SET verification_credits = verification_credits - 1 WHERE id = ?',
    [userId]
  );
}

/**
 * Get verification credits
 */
export async function getVerificationCredits(userId) {
  const pool = getDB();
  const [users] = await pool.execute(
    'SELECT verification_credits, monthly_credits_used, last_credit_reset FROM users WHERE id = ?',
    [userId]
  );
  
  if (!users[0]) return 0;
  
  const user = users[0];
  const monthlyFreeCredits = 100;
  const now = new Date();
  const lastReset = user.last_credit_reset ? new Date(user.last_credit_reset) : null;
  const needsReset = !lastReset || (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear());
  
  // If reset is needed, the credits used should be 0
  const creditsUsedThisMonth = needsReset ? 0 : (user.monthly_credits_used || 0);
  const freeCreditsRemaining = Math.max(0, monthlyFreeCredits - creditsUsedThisMonth);
  
  return freeCreditsRemaining;
}

/**
 * Add verification to history
 */
export async function addVerificationHistory(verificationData) {
  const pool = getDB();
  const { userId, type, referenceId, status } = verificationData;
  
  await pool.execute(
    'INSERT INTO verification_history (user_id, verification_type, reference_id, status) VALUES (?, ?, ?, ?)',
    [userId, type, referenceId || null, status]
  );
}

/**
 * Get verification history for user
 */
export async function getVerificationHistory(userId, limit = 100) {
  const pool = getDB();
  const [history] = await pool.execute(
    'SELECT * FROM verification_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [userId, limit]
  );
  
  return history.map(record => ({
    id: record.id,
    userId: record.user_id,
    type: record.verification_type,
    referenceId: record.reference_id,
    status: record.status,
    verifiedAt: record.created_at
  }));
}
