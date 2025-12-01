# 🚀 XAMPP MySQL Setup Guide for ASURE System

## Overview

This guide shows you how to switch from MongoDB to XAMPP's MySQL database.

---

## ✅ Step-by-Step Setup

### 1️⃣ Install and Start XAMPP

**Download XAMPP:**

- Visit: https://www.apachefriends.org/download.html
- Download Windows version
- Install (default location: `C:\xampp`)

**Start XAMPP Services:**

1. Open **XAMPP Control Panel** (Run as Administrator)
2. Click **Start** button for:
   - ✅ **Apache** (for phpMyAdmin web interface)
   - ✅ **MySQL** (for database server)
3. Both should show **green highlight** when running

**Verify MySQL is Running:**

- Port 3306 should be active
- If port conflict, click **Config** → **my.ini** and change port

---

### 2️⃣ Create Database Using phpMyAdmin

**Access phpMyAdmin:**

1. Open browser: `http://localhost/phpmyadmin`
2. You should see the phpMyAdmin interface

**Create New Database:**

1. Click **"New"** in the left sidebar
2. Enter database name: `asure_verification_db`
3. Select Collation: `utf8mb4_general_ci` (recommended for UTF-8)
4. Click **"Create"** button
5. ✅ Database created!

---

### 3️⃣ Import Database Schema

**Import Tables:**

1. In phpMyAdmin, click on **`asure_verification_db`** in left sidebar
2. Click **"Import"** tab at the top
3. Click **"Choose File"** button
4. Navigate to your project folder:
   ```
   C:\Users\User\Desktop\CSE299.4_Group-4-Project\database\schema.sql
   ```
5. Click **"Go"** button at the bottom
6. Wait for success message ✅
7. Click **"Structure"** tab - you should see all tables:
   - users
   - educational_profiles
   - educational_certificates
   - medicine_profiles
   - medicines
   - tutorial_profiles
   - tutorial_certificates
   - verification_history
   - products

**Import Sample Data (Optional):**

1. Still in `asure_verification_db`, click **"Import"** tab again
2. Choose file: `database/sample_data.sql`
3. Click **"Go"**
4. ✅ Sample data imported!

**Verify Data:**

- Click **"Browse"** tab for any table to see sample records

---

### 4️⃣ Install MySQL Node.js Package

Open PowerShell/Terminal in your project folder:

```bash
cd server
npm install mysql2
```

You should see:

```
+ mysql2@3.x.x
added 1 package
```

---

### 5️⃣ Update Server Configuration

**Edit `server/.env` file:**

Open: `C:\Users\User\Desktop\CSE299.4_Group-4-Project\server\.env`

Replace entire content with:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration - XAMPP MySQL
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=asure_verification_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=2h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important Notes:**

- ✅ `DB_PASSWORD=` is **empty** (XAMPP MySQL has no password by default)
- ✅ `DB_PORT=3306` is MySQL default port
- ✅ `DB_USER=root` is XAMPP default user

---

### 6️⃣ Update Database Connection in Code

**Edit `server/index.js`:**

1. Open: `C:\Users\User\Desktop\CSE299.4_Group-4-Project\server\index.js`
2. Find **line 2** (near the top):
   ```javascript
   import { connectDB, getDB } from "./db.js";
   ```
3. Replace with:
   ```javascript
   import { connectDB, getDB } from "./db-mysql.js";
   ```
4. Save the file

---

### 7️⃣ Start the Server

Open PowerShell/Terminal:

```bash
cd server
npm start
```

**You should see:**

```
Express server listening on http://localhost:4000
✅ Connected to MySQL database successfully
```

**If you see this, SUCCESS! 🎉**

---

## 🔍 Verify Connection

### Check 1: Server Ping

Open browser: `http://localhost:4000/api/ping`

- Should show: `pong`

### Check 2: View Data in phpMyAdmin

1. Go to: `http://localhost/phpmyadmin`
2. Click `asure_verification_db` → any table → Browse
3. You should see data (if you imported sample_data.sql)

### Check 3: Test Registration

1. Start frontend: `npm run dev`
2. Go to: `http://localhost:5173`
3. Register a new user
4. Check phpMyAdmin → `users` table
5. You should see the new user! ✅

---

## 🎯 Test the Full Flow

### Medicine Entry Test:

1. **Login** as Medicine Company (MEDICINE role)
2. Dashboard shows **2 buttons** (Verify & Enter)
3. Click **"Enter New Medicine"**
4. See **colorful gradient form** 💜
5. Fill all fields (Manufacturer auto-fills)
6. Click **"Save Medicine"**
7. Success message appears ✅
8. Check phpMyAdmin → `medicines` table → Browse
9. Your medicine entry is there! 🎉

### Verification Test:

1. Click **"Verify Medicine"**
2. Enter the medicine code you just saved
3. Click **"Verify"**
4. Medicine details appear if authentic ✅

---

## 🛠️ Troubleshooting XAMPP

### MySQL Won't Start

**Problem:** Port 3306 already in use

**Solution:**

1. Check if another MySQL is running:
   ```powershell
   netstat -ano | findstr :3306
   ```
2. Stop other MySQL services in Windows Services
3. OR change port in XAMPP: Config → my.ini → port=3307

### phpMyAdmin Not Loading

**Problem:** Apache not running

**Solution:**

1. Start Apache in XAMPP Control Panel
2. Check port 80 is free
3. Visit `http://localhost` first to verify Apache works

### "Access Denied" Error

**Problem:** Wrong MySQL credentials

**Solution:**

1. XAMPP default: user=`root`, password=`(empty)`
2. If you set a password, update `.env` file:
   ```env
   DB_PASSWORD=your_password_here
   ```

### "Database Not Found"

**Problem:** Database not created

**Solution:**

1. Go to phpMyAdmin
2. Create `asure_verification_db` manually
3. Import schema.sql again

---

## 📊 Database Management with phpMyAdmin

### View All Data:

`http://localhost/phpmyadmin` → `asure_verification_db` → Browse any table

### Run SQL Queries:

Click **"SQL"** tab and run custom queries:

```sql
-- View all medicines
SELECT * FROM medicines;

-- View all certificates
SELECT * FROM educational_certificates;

-- Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

### Export Database:

1. Select `asure_verification_db`
2. Click **"Export"** tab
3. Choose format (SQL recommended)
4. Click **"Go"** to download

### Backup Database:

Export regularly to keep backups of your data!

---

## ✅ You're All Set!

**XAMPP MySQL is now connected to your ASURE system!**

### Quick Checklist:

- ✅ XAMPP MySQL running (port 3306)
- ✅ Database `asure_verification_db` created
- ✅ Schema imported (all tables visible)
- ✅ `mysql2` package installed
- ✅ `.env` configured (empty password)
- ✅ `server/index.js` using `db-mysql.js`
- ✅ Server started successfully
- ✅ Data saves and verifies correctly

**Everything should work perfectly now! 🚀**

Need help? Check phpMyAdmin to see if data is being saved!
