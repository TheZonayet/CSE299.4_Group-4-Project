# 🔌 API Setup Guide - Profile & Payment System

## 📍 Where APIs Are Located

### Backend (Server)

- **Main File**: `server/index.js`
- **Routes Folder**: `server/routes/`
- **Controllers**: `server/controllers/`
- **Services**: `server/services/`

### Frontend (Client)

- **API Service**: `src/services/api.ts` and `frontend/src/services/api.ts`

---

## 🔍 Existing APIs (Currently Working)

### In `server/index.js`:

```javascript
// Auth APIs
POST   /api/register              - Register new user
POST   /api/login                 - Login user
GET    /api/me                    - Get current user
GET    /api/profile               - Get user profile
PUT    /api/profile               - Update user profile

// Verification APIs
POST   /api/verify                - Perform verification
GET    /api/verification-history  - Get verification history
GET    /api/verification-limits   - Get user credits

// Domain-specific APIs (in routes/)
/api/education/*                  - Education verification
/api/medicine/*                   - Medicine verification
/api/tutorial/*                   - Tutorial verification
/api/product/*                    - Product verification
/api/ai/*                         - AI services
```

---

## ✨ NEW APIs Needed for Profile & Payment System

### 1. Profile Picture Upload API

**Backend Location**: `server/index.js` (add after line 197)

```javascript
// Profile picture upload
app.put(
  "/api/profile/upload-picture",
  authMiddleware,
  wrapAsync(async (req, res) => {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ error: "Profile picture is required" });
    }

    // Validate base64 image (optional size check)
    const base64Size = (profilePicture.length * 3) / 4 / (1024 * 1024); // Size in MB
    if (base64Size > 5) {
      return res.status(400).json({ error: "Image size exceeds 5MB limit" });
    }

    const db = getDB();
    const user = await userHelpers.findUserById(req.user.sub);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update profile table based on user role
    const profileTable = {
      EDUCATION: "educational_profiles",
      MEDICINE: "medicine_profiles",
      TUTORIALS: "tutorial_profiles",
    }[user.role];

    if (profileTable) {
      await db.execute(
        `UPDATE ${profileTable} SET profile_picture = ?, updated_at = NOW() WHERE user_id = ?`,
        [profilePicture, req.user.sub]
      );
    }

    return res.json({
      success: true,
      message: "Profile picture updated successfully",
    });
  })
);
```

---

### 2. Credits Balance API

**Backend Location**: `server/index.js` (add after line 232)

```javascript
// Get user credits with monthly reset logic
app.get(
  "/api/credits/balance",
  authMiddleware,
  wrapAsync(async (req, res) => {
    const db = getDB();

    // Get user with credit info
    const [users] = await db.execute(
      `SELECT 
      verification_credits,
      monthly_credits_used,
      last_credit_reset,
      total_credits_purchased
    FROM users 
    WHERE id = ?`,
      [req.user.sub]
    );

    if (!users.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const now = new Date();
    const lastReset = user.last_credit_reset
      ? new Date(user.last_credit_reset)
      : null;

    // Check if we need to reset monthly credits
    const needsReset =
      !lastReset ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear();

    if (needsReset) {
      // Reset monthly credits
      await db.execute(
        `UPDATE users 
       SET monthly_credits_used = 0, 
           last_credit_reset = NOW() 
       WHERE id = ?`,
        [req.user.sub]
      );
      user.monthly_credits_used = 0;
    }

    const monthlyFreeCredits = 100;
    const creditsUsedThisMonth = user.monthly_credits_used || 0;
    const freeCreditsRemaining = Math.max(
      0,
      monthlyFreeCredits - creditsUsedThisMonth
    );
    const purchasedCredits = user.verification_credits || 0;
    const totalAvailable = freeCreditsRemaining + purchasedCredits;

    return res.json({
      monthlyFree: monthlyFreeCredits,
      monthlyUsed: creditsUsedThisMonth,
      freeRemaining: freeCreditsRemaining,
      purchased: purchasedCredits,
      totalPurchased: user.total_credits_purchased || 0,
      totalAvailable: totalAvailable,
    });
  })
);
```

---

### 3. Credit Packages API

**Backend Location**: `server/index.js` (add after credits balance)

```javascript
// Get available credit packages
app.get(
  "/api/credits/packages",
  wrapAsync(async (req, res) => {
    const db = getDB();

    const [packages] = await db.execute(
      `SELECT id, name, credits, price_bdt, description, is_recommended 
     FROM credit_packages 
     WHERE is_active = TRUE 
     ORDER BY credits ASC`
    );

    return res.json({ packages });
  })
);
```

---

### 4. Payment Creation API

**Backend Location**: `server/index.js`

```javascript
// Create payment intent
app.post(
  "/api/payments/create",
  authMiddleware,
  wrapAsync(async (req, res) => {
    const { packageId, paymentMethod } = req.body;

    if (!packageId || !paymentMethod) {
      return res
        .status(400)
        .json({ error: "Package ID and payment method are required" });
    }

    const validMethods = ["BKASH", "VISA", "MASTERCARD", "BANK_TRANSFER"];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    const db = getDB();

    // Get package details
    const [packages] = await db.execute(
      "SELECT * FROM credit_packages WHERE id = ? AND is_active = TRUE",
      [packageId]
    );

    if (!packages.length) {
      return res.status(404).json({ error: "Package not found" });
    }

    const pkg = packages[0];

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create payment record
    const [result] = await db.execute(
      `INSERT INTO payments 
     (user_id, amount, credits_purchased, payment_method, transaction_id, payment_status) 
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
      [req.user.sub, pkg.price_bdt, pkg.credits, paymentMethod, transactionId]
    );

    // In production, you would integrate with actual payment gateways here:
    // - bKash Payment API
    // - Stripe for Visa/Mastercard
    // - Bank transfer instructions

    return res.json({
      paymentId: result.insertId,
      transactionId: transactionId,
      amount: pkg.price_bdt,
      credits: pkg.credits,
      paymentMethod: paymentMethod,
      status: "PENDING",
      // For demo purposes - in production, return payment gateway URL
      paymentUrl: `#/payment/${transactionId}`,
      instructions: getPaymentInstructions(
        paymentMethod,
        pkg.price_bdt,
        transactionId
      ),
    });
  })
);

// Helper function for payment instructions
function getPaymentInstructions(method, amount, txnId) {
  switch (method) {
    case "BKASH":
      return {
        steps: [
          "Open your bKash app",
          'Go to "Payment"',
          `Enter merchant number: 01711-XXXXXX`,
          `Enter amount: ৳${amount}`,
          `Reference: ${txnId}`,
          "Complete the payment",
          "SMS us the transaction ID",
        ],
      };
    case "BANK_TRANSFER":
      return {
        bankName: "Dutch Bangla Bank",
        accountNumber: "XXXX-XXXX-XXXX",
        accountName: "ASURE Verification Ltd.",
        amount: `৳${amount}`,
        reference: txnId,
      };
    default:
      return { message: "Payment gateway integration coming soon" };
  }
}
```

---

### 5. Payment Verification API

**Backend Location**: `server/index.js`

```javascript
// Verify and complete payment (admin/webhook endpoint)
app.post(
  "/api/payments/verify",
  authMiddleware,
  wrapAsync(async (req, res) => {
    const { transactionId, gatewayTransactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const db = getDB();

    // Get payment record
    const [payments] = await db.execute(
      "SELECT * FROM payments WHERE transaction_id = ? AND user_id = ?",
      [transactionId, req.user.sub]
    );

    if (!payments.length) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = payments[0];

    if (payment.payment_status === "COMPLETED") {
      return res.status(400).json({ error: "Payment already completed" });
    }

    // Update payment status
    await db.execute(
      `UPDATE payments 
     SET payment_status = 'COMPLETED', 
         gateway_transaction_id = ?,
         completed_at = NOW() 
     WHERE id = ?`,
      [gatewayTransactionId || transactionId, payment.id]
    );

    // Add credits to user account
    await db.execute(
      `UPDATE users 
     SET verification_credits = verification_credits + ?,
         total_credits_purchased = total_credits_purchased + ?
     WHERE id = ?`,
      [payment.credits_purchased, payment.credits_purchased, payment.user_id]
    );

    // Record credit usage
    await db.execute(
      `INSERT INTO credit_usage 
     (user_id, credits_added, credits_removed, balance_after, description) 
     VALUES (?, ?, 0, 
       (SELECT verification_credits FROM users WHERE id = ?), 
       ?)`,
      [
        payment.user_id,
        payment.credits_purchased,
        payment.user_id,
        `Purchased ${payment.credits_purchased} credits via ${payment.payment_method}`,
      ]
    );

    return res.json({
      success: true,
      message: "Payment verified successfully",
      creditsAdded: payment.credits_purchased,
    });
  })
);
```

---

### 6. Update Verification Deduction Logic

**Backend Location**: `server/index.js` - UPDATE existing `/api/verify` endpoint (line 197)

```javascript
// Replace the existing /api/verify endpoint with this:
app.post(
  "/api/verify",
  authMiddleware,
  wrapAsync(async (req, res) => {
    const { type, qrCode, metadata } = req.body;
    if (!type) {
      return res.status(400).json({ error: "Verification type is required" });
    }

    const db = getDB();

    // Get user's credit balance
    const [users] = await db.execute(
      `SELECT 
      verification_credits,
      monthly_credits_used,
      last_credit_reset
    FROM users 
    WHERE id = ?`,
      [req.user.sub]
    );

    if (!users.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const monthlyFreeCredits = 100;
    const creditsUsedThisMonth = user.monthly_credits_used || 0;
    const freeCreditsRemaining = Math.max(
      0,
      monthlyFreeCredits - creditsUsedThisMonth
    );
    const purchasedCredits = user.verification_credits || 0;
    const totalAvailable = freeCreditsRemaining + purchasedCredits;

    if (totalAvailable <= 0) {
      return res.status(403).json({
        error: "Insufficient verification credits",
        creditsRemaining: 0,
      });
    }

    // Deduct credits (prefer free credits first)
    if (freeCreditsRemaining > 0) {
      // Use free monthly credit
      await db.execute(
        `UPDATE users 
       SET monthly_credits_used = monthly_credits_used + 1 
       WHERE id = ?`,
        [req.user.sub]
      );
    } else {
      // Use purchased credit
      await db.execute(
        `UPDATE users 
       SET verification_credits = verification_credits - 1 
       WHERE id = ?`,
        [req.user.sub]
      );
    }

    // Record verification history
    await userHelpers.addVerificationHistory({
      userId: req.user.sub,
      type: type.toUpperCase(),
      referenceId: qrCode || JSON.stringify(metadata),
      status: "SUCCESS",
    });

    // Record credit usage
    await db.execute(
      `INSERT INTO credit_usage 
     (user_id, credits_added, credits_removed, balance_after, description) 
     VALUES (?, 0, 1, ?, ?)`,
      [req.user.sub, totalAvailable - 1, `${type.toUpperCase()} verification`]
    );

    return res.json({
      verification: {
        id: randomUUID(),
        userId: req.user.sub,
        type,
        status: "verified",
        creditsRemaining: totalAvailable - 1,
      },
    });
  })
);
```

---

## 🎨 Frontend API Service Updates

### In `src/services/api.ts` and `frontend/src/services/api.ts`:

Add these functions at the end of the file:

```typescript
// Profile picture upload
export async function uploadProfilePicture(profilePicture: string) {
  const res = await fetch(`${API_BASE}/api/profile/upload-picture`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ profilePicture }),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    let txt = await res.text();
    try {
      txt = JSON.parse(txt)?.error ?? txt;
    } catch {}
    throw new Error(txt || "Failed to upload profile picture");
  }
  return await res.json();
}

// Get credits balance
export async function getCreditsBalance() {
  const res = await fetch(`${API_BASE}/api/credits/balance`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new Error("Failed to fetch credits balance");
  }
  return await res.json();
}

// Get credit packages
export async function getCreditPackages() {
  const res = await fetch(`${API_BASE}/api/credits/packages`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch credit packages");
  }
  return await res.json();
}

// Create payment
export async function createPayment(packageId: number, paymentMethod: string) {
  const res = await fetch(`${API_BASE}/api/payments/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ packageId, paymentMethod }),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    let txt = await res.text();
    try {
      txt = JSON.parse(txt)?.error ?? txt;
    } catch {}
    throw new Error(txt || "Failed to create payment");
  }
  return await res.json();
}

// Verify payment
export async function verifyPayment(
  transactionId: string,
  gatewayTransactionId?: string
) {
  const res = await fetch(`${API_BASE}/api/payments/verify`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ transactionId, gatewayTransactionId }),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    let txt = await res.text();
    try {
      txt = JSON.parse(txt)?.error ?? txt;
    } catch {}
    throw new Error(txt || "Failed to verify payment");
  }
  return await res.json();
}
```

---

## 🗄️ Database Migration

**CRITICAL**: Run this SQL first!

```bash
# Location: database/migrations/add_profile_features.sql
```

Execute in MySQL:

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Select `asure_verification_db` database
3. Go to SQL tab
4. Copy and paste the content from `database/migrations/add_profile_features.sql`
5. Click "Go" to execute

---

## 📝 Implementation Checklist

### Step 1: Database Setup

- [ ] Open phpMyAdmin
- [ ] Execute `database/migrations/add_profile_features.sql`
- [ ] Verify new tables created: `payments`, `credit_packages`, `credit_usage`
- [ ] Verify new columns added to `users` table

### Step 2: Backend Setup

- [ ] Add all 6 new API endpoints to `server/index.js`
- [ ] Update existing `/api/verify` endpoint with new credit logic
- [ ] Import `getDB` if not already imported

### Step 3: Frontend Setup

- [ ] Add 5 new API functions to `src/services/api.ts`
- [ ] Copy same functions to `frontend/src/services/api.ts`

### Step 4: Testing

- [ ] Restart backend server: `cd server && npm start`
- [ ] Restart frontend: `cd frontend && npm run dev` (or just `npm run dev` from root)
- [ ] Login to application
- [ ] Go to Profile page
- [ ] Test profile picture upload
- [ ] Check credits display
- [ ] Try opening payment modal

---

## 🔗 API Endpoints Summary

| Method | Endpoint                      | Purpose                        | Auth Required |
| ------ | ----------------------------- | ------------------------------ | ------------- |
| PUT    | `/api/profile/upload-picture` | Upload profile image           | ✅            |
| GET    | `/api/credits/balance`        | Get credits with monthly reset | ✅            |
| GET    | `/api/credits/packages`       | List available packages        | ❌            |
| POST   | `/api/payments/create`        | Create payment intent          | ✅            |
| POST   | `/api/payments/verify`        | Complete payment               | ✅            |
| POST   | `/api/verify`                 | Verify with credit deduction   | ✅            |

---

## 🚀 Quick Setup Commands

```powershell
# 1. Navigate to project
cd "C:\Users\User\Desktop\CSE299.4_Group-4-Project"

# 2. Run database migration (in phpMyAdmin)
# Open: http://localhost/phpmyadmin
# Select: asure_verification_db
# Run: database/migrations/add_profile_features.sql

# 3. Update backend (copy APIs from this guide to server/index.js)

# 4. Update frontend API service (copy functions to src/services/api.ts)

# 5. Restart servers
cd server
npm start

# In new terminal
cd frontend
npm run dev
```

---

## 📞 Need Help?

If you see errors:

1. Check database migration ran successfully
2. Verify MySQL is running (XAMPP)
3. Check server logs for errors
4. Verify API_BASE in frontend matches server port (4000)
5. Check browser console for frontend errors
