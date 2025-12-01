# 🚀 Quick Start Guide - ASURE Verification System

## ✅ FIXES APPLIED

### 1. Fixed "Network Error Occurred" Issue

**Problems Found:**

- ✅ Port mismatch: Frontend was calling port 3001, server runs on port 4000
- ✅ Token key mismatch: Forms used "token", API service uses "asure_token"

**Solutions Applied:**

- ✅ Updated all API endpoints to use `http://localhost:4000`
- ✅ Updated all forms to use correct token key: `asure_token`
- ✅ Verified server configuration (PORT=4000 in .env)

### 2. Created SQL Database Files

- ✅ `database/schema.sql` - Complete database schema
- ✅ `database/sample_data.sql` - Sample test data
- ✅ `server/db-mysql.js` - MySQL database adapter
- ✅ `DATABASE_README.md` - Full database documentation

---

## 🎯 How to Start the Application

### Step 1: Start the Backend Server

```bash
cd server
npm install
npm start
```

**You should see:**

```
Express server listening on http://localhost:4000
✅ Connected to MongoDB
```

### Step 2: Start the Frontend (New Terminal)

```bash
cd c:\Users\User\Desktop\CSE299.4_Group-4-Project
npm install
npm run dev
```

**You should see:**

```
VITE ready in XXX ms
➜ Local: http://localhost:5173
```

### Step 3: Test the Application

1. Open browser: `http://localhost:5173`
2. Register/Login as Medicine Company (role: MEDICINE)
3. Click "Enter New Medicine"
4. Fill the colorful form
5. Click "Save Medicine"
6. Success! ✅ Data saved to database

---

## 🔧 Troubleshooting

### Still Getting "Network Error"?

**Check 1: Is the server running?**

```bash
# Open browser and visit:
http://localhost:4000/api/ping
# Should show: "pong"
```

**Check 2: Check browser console**

```javascript
// Open browser DevTools (F12) → Console
// Look for errors like:
// - CORS errors
// - 401 Unauthorized (token issue)
// - 404 Not Found (wrong endpoint)
```

**Check 3: Verify token exists**

```javascript
// In browser console:
localStorage.getItem("asure_token");
// Should show a JWT token, not null
```

**Check 4: Clear cache and re-login**

```javascript
// In browser console:
localStorage.clear();
// Then login again
```

---

## 📊 Database Information

### Current Setup: MongoDB

- Connection: `mongodb://127.0.0.1:27017`
- Database: `asure`
- Collections: users, educational_certificates, medicines, tutorial_certificates

### Want to Switch to XAMPP MySQL?

1. **Start XAMPP** - Open XAMPP Control Panel, start Apache & MySQL
2. **Create Database** - Visit `http://localhost/phpmyadmin`, create `asure_verification_db`
3. **Import Schema** - In phpMyAdmin, import `database/schema.sql`
4. **Install Package** - Run: `cd server && npm install mysql2`
5. **Update Code** - In `server/index.js` line 2, change `'./db.js'` to `'./db-mysql.js'`
6. **Update .env** - Add: `DB_TYPE=mysql`, `DB_USER=root`, `DB_PASSWORD=`, `DB_NAME=asure_verification_db`
7. **Restart Server** - `npm start` (look for MySQL connection message)

---

## 🎨 Features Working

✅ Colorful gradient forms  
✅ Role-based dashboards  
✅ Auto-fill institute/company info  
✅ Data saving to database  
✅ Data verification  
✅ Token authentication  
✅ File upload support (PNG)

---

## 📝 API Endpoints

### Authentication

- POST `/api/register` - Register
- POST `/api/login` - Login
- GET `/api/me` - Get profile

### Medicine

- POST `/api/medicine/create` - Add medicine
- POST `/api/medicine/verify` - Verify medicine

### Education

- POST `/api/education/create` - Add certificate
- POST `/api/education/verify` - Verify certificate

### Tutorial

- POST `/api/tutorial/create` - Add certificate
- POST `/api/tutorial/verify` - Verify certificate

---

## 🎉 Everything Should Work Now!

The "Network error occurred" issue has been fixed. Just make sure:

1. ✅ Server is running on port 4000
2. ✅ You're logged in (token exists)
3. ✅ MongoDB is running
4. ✅ Browser can access localhost:4000

**Test it now and it should work perfectly!** 🚀
