# Asure - Complete Setup Guide

## 🎯 Project Complete - All Features Implemented!

### ✅ What's Been Built

#### Backend (Node.js + Express + MongoDB)

- **Role-based authentication** with JWT tokens
- **4 user roles**: EDUCATION, PERSONAL, TUTORIALS, MEDICINE
- **Dynamic registration forms** with role-specific fields
- **Profile management** with role-based field updates
- **Verification system** with credit tracking
- **Protected API endpoints** with JWT middleware

#### Frontend (React + TypeScript + Vite)

- **React Router** for navigation
- **4 main pages**: Login, Home, Profile, History
- **Reusable components**: Sidebar, StatusBar, BackButton, BigActionButton
- **Role-specific registration** with validation
- **Token-based authentication** with localStorage
- **Responsive design** with Bootstrap + custom CSS

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (already done)
npm install

# Start MongoDB (choose one method):

# Option A: Local MongoDB (if installed)
# Open PowerShell as Administrator
Start-Service MongoDB

# Option B: MongoDB in separate terminal (no admin)
$mongod = Get-ChildItem "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" | Select-Object -First 1 -Expand FullName
New-Item -ItemType Directory -Force "$env:USERPROFILE\mongodb\data"
& $mongod --dbpath "$env:USERPROFILE\mongodb\data"

# Option C: MongoDB Atlas (cloud - free)
# Update server/.env with your Atlas connection string

# Start the backend server
npm run dev

# Server runs on http://localhost:4000
```

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies (already done)
npm install

# Start the frontend
npm run dev

# Frontend runs on http://localhost:5173
```

---

## 📋 User Roles & Registration Fields

### EDUCATION (Educational Institute)

- Institute Name
- Official Phone
- EIIN Number
- Official Email
- Password + Confirm Password

### PERSONAL

- Email
- Password + Confirm Password

### TUTORIALS (Tutorial Institute)

- Institute Name
- Official Phone
- Govt. License Number
- Official Email
- Password + Confirm Password

### MEDICINE (Medicine Company)

- Company Name
- Official Phone
- Govt. License Number
- Official Email
- Password + Confirm Password

---

## 🔑 API Endpoints

### Public Endpoints

- `POST /api/register` - Register new user (role-specific)
- `POST /api/login` - Login (returns JWT token)
- `GET /api/ping` - Health check

### Protected Endpoints (Require JWT Token)

- `GET /api/me` - Get current user (without sensitive data)
- `GET /api/profile` - Get full profile
- `PUT /api/profile` - Update profile fields
- `POST /api/verify` - Create verification (decrements credits)
- `GET /api/verification-history` - Get user's verification history
- `GET /api/verification-limits` - Get remaining credits

---

## 🎨 Frontend Pages

### `/login`

- 4 role selection buttons with icons
- Dynamic login/register forms
- Role-specific field validation
- Automatic redirect after registration

### `/home` (Protected)

- Sidebar with logo, credits, navigation
- 4 verification action buttons:
  - 🎓 Verify Educational Institute
  - 💊 Verify Medicines
  - 📦 Verify Random Products
  - 📜 Verify Tutorial Certificate

### `/profile` (Protected)

- View user information
- Edit role-specific profile fields
- Display verification credits
- Member since date

### `/history` (Protected)

- List all verifications
- Filter by type
- Timestamp and status
- Empty state for new users

---

## 🔐 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with configurable expiration (default 2h)
- Protected routes with auth middleware
- Email uniqueness validation
- Role-based field access control
- Token stored in localStorage (client-side)
- Automatic token validation on protected routes

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  id: "uuid",
  role: "EDUCATION | PERSONAL | TUTORIALS | MEDICINE",
  auth: {
    email: "string",
    passwordHash: "bcrypt"
  },
  profile: {
    // Role-specific fields
    instituteName?: string,
    companyName?: string,
    officialPhone?: string,
    eiinNumber?: string,
    govtLicenseNumber?: string,
    officialEmail?: string
  },
  verificationCredits: 100,
  createdAt: Date
}
```

### Verifications Collection

```javascript
{
  id: "uuid",
  userId: "string",
  type: "educational | medicine | product | tutorial",
  qrCode?: "string",
  metadata: {},
  status: "verified | pending | failed",
  verifiedAt: Date
}
```

---

## 🧪 Testing the Application

### 1. Register a User

```bash
# Example: Register as PERSONAL user
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "role": "PERSONAL",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. Login

```bash
# Login to get JWT token
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "PERSONAL",
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: { "user": {...}, "token": "jwt_token_here" }
```

### 3. Use Protected Endpoints

```bash
# Get profile (replace YOUR_TOKEN)
curl http://localhost:4000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create verification
curl -X POST http://localhost:4000/api/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "medicine", "qrCode": "QR12345"}'
```

---

## 🎯 Next Steps (Future Enhancements)

### Immediate

- [ ] Add password reset functionality
- [ ] Email verification on registration
- [ ] QR code scanner integration
- [ ] File upload for certificates/documents

### Medium-term

- [ ] Admin dashboard for managing users
- [ ] Verification audit trail
- [ ] Export verification reports (PDF/CSV)
- [ ] Multi-factor authentication (MFA)

### Long-term (Blockchain Integration)

- [ ] Smart contract integration (Solidity)
- [ ] NFT minting for certificates
- [ ] Blockchain transaction logging
- [ ] Decentralized verification storage
- [ ] Multi-signature approvals
- [ ] Reputation scoring system

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
Test-NetConnection localhost -Port 27017

# View MongoDB logs (if running as service)
Get-EventLog -LogName Application -Source MongoDB

# Reset MongoDB data (warning: deletes all data)
Remove-Item "$env:USERPROFILE\mongodb\data" -Recurse -Force
```

### Frontend Build Issues

```bash
# Clear node_modules and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# Restart dev server
npm run dev
```

### TypeScript Errors

- Restart VS Code / TypeScript server
- Check `tsconfig.json` paths
- Run `npm run build` to verify production build

---

## 📦 Dependencies

### Backend

- express ^4.21.2
- mongodb ^7.0.0
- bcryptjs ^2.4.3
- jsonwebtoken ^9.0.2
- cors ^2.8.5
- dotenv ^17.2.3

### Frontend

- react ^18.x
- react-router-dom ^6.x
- typescript ^5.x
- vite ^5.x
- bootstrap ^5.x

---

## 📝 Environment Variables

### `server/.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=asure
PORT=4000
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRES_IN=2h
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

---

## 🎉 Application is Ready!

All features are implemented and working:

- ✅ Separate frontend & backend
- ✅ MongoDB database integration
- ✅ JWT authentication
- ✅ Role-based registration (4 roles)
- ✅ Dynamic forms with validation
- ✅ Protected routing
- ✅ Profile management
- ✅ Verification system with credits
- ✅ History tracking
- ✅ Reusable components
- ✅ Responsive design
- ✅ Professional UI/UX

Start both servers and visit http://localhost:5173 to begin!
