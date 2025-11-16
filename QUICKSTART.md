# ASURE - Quick Start Guide

## 🐛 Bugs Fixed

All critical bugs have been resolved:

1. ✅ **Frontend-Backend Connection** - Added `.env` file with `VITE_API_BASE=http://localhost:4000`
2. ✅ **TypeScript Configuration** - Added `forceConsistentCasingInFileNames` to `tsconfig.app.json`
3. ✅ **Accessibility Issues** - Fixed form accessibility in AuthForm and ProfilePage
4. ✅ **Inline Styles** - Moved inline styles from Dashboard.tsx to CSS file
5. ✅ **Security** - Added `.env` files to `.gitignore`
6. ✅ **NPM Scripts** - Added convenient start scripts

## 🚀 How to Run

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (running on localhost:27017)

### Step 1: Start MongoDB

Choose one method:

#### Option A: MongoDB as Windows Service
```powershell
# Run as Administrator
Start-Service MongoDB
```

#### Option B: MongoDB Manually
```powershell
# In a separate PowerShell window
mongod --dbpath "C:\data\db"
```

### Step 2: Install Dependencies

```powershell
# Install frontend dependencies (root directory)
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 3: Start the Application

#### Option 1: Start Both (Frontend + Backend)
```powershell
npm run start:all
```

This will:
- Start the backend server on http://localhost:4000
- Start the frontend dev server on http://localhost:5173

#### Option 2: Start Separately

**Terminal 1 - Backend:**
```powershell
npm run server
```

**Terminal 2 - Frontend:**
```powershell
npm start
```

### Step 4: Access the Application

Open your browser and go to: **http://localhost:5173**

## 📝 Configuration Files

### Frontend Environment (`.env`)
```
VITE_API_BASE=http://localhost:4000
```

### Backend Environment (`server/.env`)
```
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=asure
PORT=4000
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=2h
```

## 🔧 Available Scripts

- `npm start` - Start frontend development server
- `npm run dev` - Same as npm start
- `npm run server` - Start backend server only
- `npm run start:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## 🎯 Testing the Application

1. **Register a User**
   - Go to http://localhost:5173
   - Select a role (EDUCATION, PERSONAL, TUTORIALS, or MEDICINE)
   - Fill in the registration form
   - Click "Register"

2. **Login**
   - Use the credentials you just created
   - Click "Login"

3. **Use Features**
   - **Home** - Create verifications
   - **Profile** - Update your profile information
   - **History** - View verification history

## 🆘 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `Get-Service MongoDB` or check the mongod process
- Verify MongoDB URI in `server/.env`

### Port Already in Use
- Frontend (5173): `netstat -ano | findstr :5173` then `taskkill /PID <PID> /F`
- Backend (4000): `netstat -ano | findstr :4000` then `taskkill /PID <PID> /F`

### Module Not Found Errors
```powershell
# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# For backend
cd server
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### API Connection Issues
- Check that `.env` file exists in the root directory
- Verify backend is running on port 4000
- Check browser console for CORS errors

## 🎉 Everything Should Now Work!

All bugs have been fixed. The application should now:
- ✅ Connect frontend to backend properly
- ✅ Have no TypeScript errors
- ✅ Pass accessibility checks
- ✅ Follow CSS best practices
- ✅ Be easy to start and run
