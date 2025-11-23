# 🚀 Quick Start Guide

## Starting the Application

### Option 1: Automated Script (Recommended)

```powershell
.\start.ps1
```

### Option 2: Manual Start

#### Terminal 1 - Backend Server

```powershell
cd server
npm install
npm start
```

Server runs on: `http://localhost:4000`

#### Terminal 2 - Frontend Dev Server

```powershell
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173` or `http://localhost:5174`

---

## 🔑 Login Credentials

Use these test accounts or create new ones via registration:

**Student Account:**

- Email: `student@test.com`
- Password: `password123`

**Institute Account:**

- Email: `institute@test.com`
- Password: `password123`

---

## 🧭 Navigation Flow

1. **Login Page** (`/login`)

   - Select role: Student, Institute, Manufacturer, Tutorial, or Pharmacy
   - Login or Register

2. **Dashboard** (`/home`)

   - 4 verification options displayed as cards
   - Click any card to navigate to specific verification page

3. **Verification Pages**

   - `/verify-education` - Educational certificates
   - `/verify-medicine` - Medicine authentication
   - `/verify-product` - Product barcode verification
   - `/verify-tutorial` - Tutorial certificates

4. **Other Pages**
   - `/profile` - User profile management
   - `/history` - Verification history

---

## 🔧 Troubleshooting

### Port Already in Use

```powershell
# Find process on port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### TypeScript Cache Issues

- Press `Ctrl+Shift+P`
- Type: `TypeScript: Restart TS Server`
- Or reload window: `Developer: Reload Window`

### Module Not Found Errors

```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📁 Project Structure

```
CSE299.4_Group-4-Project/
├── src/                      # Frontend source
│   ├── pages/               # All page components
│   │   ├── HomePage.tsx
│   │   ├── VerifyEducation.tsx
│   │   ├── VerifyMedicine.tsx
│   │   ├── VerifyProduct.tsx
│   │   └── VerifyTutorial.tsx
│   ├── components/          # Reusable components
│   ├── contexts/            # AuthContext
│   ├── features/auth/       # Login/Register
│   └── services/            # API calls
├── server/                  # Backend (Node.js/Express)
├── .env                     # Frontend environment
└── server/.env              # Backend environment
```

---

## 🌐 API Endpoints (Backend Implementation Needed)

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Verification

- `POST /api/verify-education` - Educational certificate
- `POST /api/verify-education-image` - Image-based education
- `POST /api/verify-medicine` - Medicine search
- `POST /api/verify-medicine-image` - Image-based medicine
- `POST /api/medicine-suggestion` - AI medicine suggestions
- `POST /api/verify-product` - Product barcode
- `POST /api/verify-tutorial` - Tutorial certificate

---

## 🎯 Testing the Verification System

### 1. Test Educational Verification

- Go to `/verify-education`
- Try manual entry: Enter roll number and institute
- Try image upload: Upload a certificate image
- Check result display

### 2. Test Medicine Verification

- Go to `/verify-medicine`
- Search medicine by name
- Fill patient data form
- Click "Get AI Suggestion"
- View alternative recommendations

### 3. Test Product Verification

- Go to `/verify-product`
- Enter barcode manually
- Or upload product image
- Check similar products

### 4. Test Tutorial Verification

- Go to `/verify-tutorial`
- Enter certificate ID
- Or upload certificate image
- View YouTube recommendations

---

## 🐛 Known Issues

1. **AuthContext Import Warning**: TypeScript cache issue - restart TS server
2. **Backend Not Implemented**: All API endpoints return mock data for now
3. **AI Features Pending**: Image recognition needs ML integration

---

## 📚 Documentation

- `VERIFICATION_SYSTEM_SUMMARY.md` - Complete system overview
- `BUG_FIXES_SUMMARY.md` - All bug fixes applied
- `PROJECT_CONFIG.md` - Configuration details
- `README.md` - Project overview

---

## 🔐 Environment Variables

### `.env` (Frontend - Root directory)

```env
VITE_API_BASE=http://localhost:4000
```

### `server/.env` (Backend)

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/verification_system
JWT_SECRET=your_secret_key_here
```

---

## ✨ Features Implemented

✅ Complete authentication system  
✅ 4 specialized verification pages  
✅ Dual verification modes (manual + image)  
✅ AI integration points ready  
✅ Patient data analysis for medicines  
✅ YouTube recommendations for tutorials  
✅ Responsive design (desktop, tablet, mobile)  
✅ Protected routes with JWT  
✅ Professional UI with gradients  
✅ Loading states and error handling

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review `VERIFICATION_SYSTEM_SUMMARY.md` for detailed info
3. Restart TypeScript server if seeing import errors
4. Clean install node_modules if dependencies fail

---

_Happy Verifying! 🎉_
