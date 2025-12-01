# ============================================

# ASURE Verification System - Database Guide

# ============================================

## Overview

This project supports both **MongoDB** (default) and **MySQL** databases.

---

## Current Setup (MongoDB)

The system is currently configured to use **MongoDB**.

### MongoDB Setup:

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Server automatically creates collections and indexes on startup
4. Default connection: `mongodb://localhost:27017`
5. Default database name: `asure`

---

## Switching to XAMPP MySQL (Recommended)

### Step 1: Install XAMPP

1. Download XAMPP: https://www.apachefriends.org/download.html
2. Install XAMPP (includes Apache, MySQL, PHP, phpMyAdmin)
3. Start XAMPP Control Panel
4. Start **Apache** and **MySQL** modules

### Step 2: Create Database Using phpMyAdmin

1. Open browser: `http://localhost/phpmyadmin`
2. Click **"New"** in left sidebar
3. Database name: `asure_verification_db`
4. Collation: `utf8mb4_general_ci`
5. Click **"Create"**

### Step 3: Import Database Schema

1. In phpMyAdmin, select `asure_verification_db`
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select: `database/schema.sql`
5. Click **"Go"**
6. Wait for success message ✅
7. (Optional) Import `database/sample_data.sql` for test data

### Step 4: Install MySQL Dependencies

```bash
cd server
npm install mysql2
```

### Step 5: Update server/.env File

```env
PORT=4000
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=asure_verification_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=2h
```

**Note:** XAMPP MySQL default password is empty (blank)

### Step 6: Update server/index.js

Change the database import at the top:

```javascript
// Find this line (around line 2):
import { connectDB, getDB } from "./db.js";

// Replace with:
import { connectDB, getDB } from "./db-mysql.js";
```

### Step 7: Restart Server

```bash
cd server
npm start
```

Look for: **"✅ Connected to MySQL database successfully"**

---

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Education

- `POST /api/education/create` - Create certificate
- `POST /api/education/verify` - Verify certificate

### Medicine

- `POST /api/medicine/create` - Create medicine entry
- `POST /api/medicine/verify` - Verify medicine

### Tutorial

- `POST /api/tutorial/create` - Create certificate
- `POST /api/tutorial/verify` - Verify certificate

---

## Frontend API Configuration

All API calls use: `http://localhost:4000/api/...`

### Token Storage

- Token key: `token` (in localStorage)
- Authorization header: `Bearer <token>`

---

## Testing the Connection

### Test MongoDB (Current):

```bash
cd server
npm start
# Look for: "✅ Connected to MongoDB"
```

### Test MySQL (After switching):

```bash
cd server
npm start
# Look for: "✅ Connected to MySQL database successfully"
```

---

## Troubleshooting

### Network Error in Frontend

**Problem**: "Network error occurred" when saving data

**Solutions**:

1. Check if server is running on port 4000
2. Verify CORS is enabled
3. Check browser console for errors
4. Ensure token exists in localStorage
5. Verify API endpoint matches server port

### Database Connection Failed

**MongoDB**:

- Check if MongoDB service is running
- Verify connection string in `.env`

**MySQL**:

- Check MySQL service status
- Verify credentials in `.env`
- Ensure database exists
- Check firewall settings

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

---

## Database Schema Summary

### Users Table

- Stores all user accounts (Education, Medicine, Tutorial, Personal)

### Profiles Tables

- `educational_profiles` - Educational institute details
- `medicine_profiles` - Medicine company details
- `tutorial_profiles` - Tutorial institute details

### Data Tables

- `educational_certificates` - Student certificates
- `medicines` - Medicine records
- `tutorial_certificates` - Tutorial course certificates
- `products` - Product verification records

### History Table

- `verification_history` - Tracks all verification attempts

---

## Quick Start Commands

```bash
# Start backend server
cd server
npm start

# Start frontend (in new terminal)
cd ..
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:4000
```
