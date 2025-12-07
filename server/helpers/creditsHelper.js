import { getDB } from '../db-mysql.js';
import { addVerificationHistory } from './userHelpers.js';

export async function consumeCreditAndLog(userId, type, referenceId) {
  const db = getDB();

  // Fetch current credit state
  const [users] = await db.execute(
    `SELECT verification_credits, monthly_credits_used, last_credit_reset
     FROM users WHERE id = ?`,
    [userId]
  );
  if (!users.length) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const user = users[0];
  const monthlyFreeCredits = 100;
  const now = new Date();
  const lastReset = user.last_credit_reset ? new Date(user.last_credit_reset) : null;
  const needsReset = !lastReset || (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear());

  if (needsReset) {
    await db.execute(
      `UPDATE users SET monthly_credits_used = 0, last_credit_reset = NOW() WHERE id = ?`,
      [userId]
    );
    user.monthly_credits_used = 0;
  }

  const creditsUsedThisMonth = user.monthly_credits_used || 0;
  const freeCreditsRemaining = Math.max(0, monthlyFreeCredits - creditsUsedThisMonth);
  const purchasedCredits = user.verification_credits || 0;
  const totalAvailable = freeCreditsRemaining + purchasedCredits;

  if (totalAvailable <= 0) {
    const err = new Error('Insufficient verification credits');
    err.status = 403;
    err.creditsRemaining = 0;
    throw err;
  }

  // Deduct credit
  if (freeCreditsRemaining > 0) {
    await db.execute(
      `UPDATE users SET monthly_credits_used = monthly_credits_used + 1 WHERE id = ?`,
      [userId]
    );
  } else {
    await db.execute(
      `UPDATE users SET verification_credits = verification_credits - 1 WHERE id = ?`,
      [userId]
    );
  }

  // Record history
  await addVerificationHistory({
    userId,
    type: type.toUpperCase(),
    referenceId: referenceId || null,
    status: 'SUCCESS'
  });

  // Record credit usage
  await db.execute(
    `INSERT INTO credit_usage (user_id, credits_used, verification_type, description)
     VALUES (?, 1, ?, ?)`,
    [userId, type.toUpperCase(), `${type.toUpperCase()} verification`]
  );

  return {
    creditsRemaining: totalAvailable - 1
  };
}
