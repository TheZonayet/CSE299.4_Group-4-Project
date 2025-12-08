# ASURE Project - Complete Structure Guide
## Simple, Organized Breakdown for Easy Explanation

---

## 📂 Project Overview Tree

```
CSE299.4_Group-4-Project/
│
├── 📱 FRONTEND (React + TypeScript + Vite)
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── pages/              ← User-facing screens
│   │   │   ├── components/         ← Reusable UI components
│   │   │   ├── services/           ← API calls
│   │   │   ├── features/           ← Feature modules
│   │   │   ├── contexts/           ← Global state
│   │   │   ├── routes/             ← Navigation logic
│   │   │   └── App.tsx             ← Main app component
│   │   ├── package.json            ← Frontend dependencies
│   │   ├── vite.config.ts          ← Build configuration
│   │   └── tsconfig.json           ← TypeScript config
│   │
│   └── src/ (Duplicate for consistency)
│       └── (Same structure as frontend/src/)
│
├── 🔌 BACKEND (Node.js + Express)
│   ├── server/
│   │   ├── index.js                ← Main server file
│   │   ├── package.json            ← Backend dependencies
│   │   ├── .env                    ← Environment variables
│   │   │
│   │   ├── routes/                 ← API endpoints
│   │   │   ├── aiRoutes.js         ← AI features
│   │   │   ├── authRoutes.js       ← Login/Register
│   │   │   ├── educationRoutes.js  ← Education APIs
│   │   │   ├── medicineRoutes.js   ← Medicine APIs
│   │   │   ├── productRoutes.js    ← Product APIs
│   │   │   └── tutorialRoutes.js   ← Tutorial APIs
│   │   │
│   │   ├── controllers/            ← Business logic
│   │   │   ├── educationController.js
│   │   │   ├── medicineController.js
│   │   │   ├── productController.js
│   │   │   └── tutorialController.js
│   │   │
│   │   ├── services/               ← External services
│   │   │   └── geminiService.js    ← AI integration
│   │   │
│   │   ├── helpers/                ← Utility functions
│   │   │   └── userHelpers.js      ← Database helpers
│   │   │
│   │   ├── db.js                   ← MongoDB connection
│   │   ├── db-mysql.js             ← MySQL connection
│   │   └── seed.js                 ← Sample data
│   │
│   └── server/ (Duplicate for consistency)
│       └── (Same structure as server/)
│
├── 🗄️  DATABASE
│   ├── database/
│   │   ├── schema.sql              ← Database structure
│   │   ├── sample_data.sql         ← Sample data
│   │   │
│   │   └── migrations/
│   │       ├── add_profile_features.sql
│   │       └── add_personal_profile_columns.sql
│   │
│   └── MySQL Configuration:
│       ├── Host: localhost
│       ├── Port: 3306
│       ├── Database: asure_verification_db
│       └── User: root (no password)
│
├── 📚 DOCUMENTATION
│   ├── README.md                   ← Project overview
│   ├── SETUP.md                    ← Installation guide
│   ├── FINAL_REPORT.md             ← Comprehensive report
│   ├── PRESENTATION_GUIDE.md       ← 20-slide outline
│   ├── DELIVERABLES_SUMMARY.md     ← Implementation guide
│   ├── API_SETUP_GUIDE.md          ← API reference
│   ├── GEMINI_AI_GUIDE.md          ← AI integration guide
│   ├── DATABASE_README.md          ← Database guide
│   ├── QUICKSTART.md               ← Quick reference
│   ├── CONFIGURATION.md            ← Config guide
│   └── BUG_FIXES_SUMMARY.md        ← Issues & fixes
│
├── 🔧 CONFIGURATION FILES
│   ├── .env                        ← Environment variables
│   ├── package.json                ← Root dependencies
│   ├── vite.config.ts              ← Vite build config
│   ├── tsconfig.json               ← TypeScript config
│   ├── eslint.config.js            ← Linting rules
│   └── index.html                  ← HTML entry point
│
├── 🚀 UTILITY SCRIPTS
│   ├── start.ps1                   ← Start all services
│   ├── start-app.ps1               ← Start frontend only
│   ├── start-backend.ps1           ← Start backend only
│   ├── start-frontend.ps1          ← Start frontend only
│   ├── start-both.ps1              ← Start both
│   ├── project-status.ps1          ← Check status
│   └── setup-gemini.ps1            ← AI setup
│
└── 📄 PROJECT ROOT FILES
    ├── package.json                ← Root config
    ├── README.md                   ← Main overview
    └── PROJECT_STRUCTURE.md        ← This file!
```

---

## 🎯 Quick Start - What Each Part Does

### 1️⃣ **FRONTEND** - What Users See
**Technology**: React 19 + TypeScript + Vite  
**Location**: `/frontend/src/` or `/src/`

| Folder | Purpose | Example |
|--------|---------|---------|
| `pages/` | Complete screens | LoginPage.tsx, MedicineDashboard.tsx |
| `components/` | Reusable UI pieces | Sidebar.tsx, Navbar.tsx, Button.tsx |
| `services/` | API communication | api.ts (fetch requests) |
| `features/` | Feature modules | auth/, verification/ |
| `contexts/` | Global state | AuthContext.tsx |
| `routes/` | Navigation | RoleBasedRedirect.tsx |
| `styles/` | CSS files | Dashboard.css, FormPages.css |

**Key Files to Explain**:
- `App.tsx` - Main entry point with all routes
- `main.tsx` - App initialization
- `services/api.ts` - All backend API calls

---

### 2️⃣ **BACKEND** - The Brain
**Technology**: Node.js + Express + MySQL  
**Location**: `/server/` or `/backend/`

| Folder | Purpose | Example |
|--------|---------|---------|
| `routes/` | API endpoints | `/api/login`, `/api/medicine/verify` |
| `controllers/` | Business logic | Process requests, validate data |
| `services/` | External APIs | geminiService.js (Google AI) |
| `helpers/` | Utilities | Database helper functions |
| `index.js` | Main server | Starts the Express server |
| `.env` | Secrets | API keys, database credentials |

**Key Files to Explain**:
- `index.js` - Server setup, routes mounting
- `routes/aiRoutes.js` - AI endpoints
- `services/geminiService.js` - Google Gemini integration
- `.env` - Configuration (PORT, DB, API keys)

---

### 3️⃣ **DATABASE** - Data Storage
**Technology**: MySQL (XAMPP)  
**Location**: `/database/`

| File | Purpose |
|------|---------|
| `schema.sql` | Table definitions & structure |
| `sample_data.sql` | Test data |
| `migrations/` | Database updates |

**Key Tables**:
```
users
├── id, role, email, password_hash
├── name, profile_picture
└── verification_credits

educational_profiles
├── instituteName, eiinNumber
├── officialEmail, officialPhone
└── (linked to users via role)

medicine_profiles
├── companyName, govtLicenseNumber
├── officialEmail, officialPhone
└── (linked to users via role)

tutorial_profiles
├── instituteName, govtLicenseNumber
├── officialEmail, officialPhone
└── (linked to users via role)
```

---

### 4️⃣ **DOCUMENTATION** - Reference Guides
All files in root directory for easy access

| Document | Use For |
|----------|---------|
| `README.md` | Overview & quick start |
| `SETUP.md` | Installation steps |
| `FINAL_REPORT.md` | Complete technical report |
| `PRESENTATION_GUIDE.md` | 20-slide defense outline |
| `API_SETUP_GUIDE.md` | API endpoint reference |
| `GEMINI_AI_GUIDE.md` | AI features explained |
| `DATABASE_README.md` | Database structure |

---

## 🔌 How They Connect

```
USER BROWSER
    ↓
FRONTEND (React)
    ├─ Shows UI
    ├─ Collects user input
    └─ Sends to Backend
         ↓
    BACKEND (Express)
         ├─ Validates request
         ├─ Processes business logic
         ├─ Calls external APIs
         └─ Queries/updates Database
              ↓
         DATABASE (MySQL)
              ├─ Stores users
              ├─ Stores certificates
              ├─ Stores medicines
              └─ Stores history
              
    Also connects to:
    GOOGLE GEMINI API
         ├─ Analyzes images
         ├─ Generates suggestions
         └─ Processes documents
```

---

## 🗂️ File Organization by Feature

### **Authentication Feature**
```
Frontend:
  src/features/auth/
  ├── LoginPage.tsx      ← User login screen
  ├── AuthForm.tsx       ← Login form component
  └── ProtectedRoute.tsx ← Route protection

Backend:
  server/routes/authRoutes.js
  └─ POST /api/register
  └─ POST /api/login
  └─ GET /api/me
  
Database:
  users table with password_hash
```

### **Medicine Verification Feature**
```
Frontend:
  src/pages/VerifyMedicine.tsx     ← Main verification page
  src/pages/EnterMedicine.tsx      ← Input medicine
  
Backend:
  server/routes/medicineRoutes.js
  ├─ POST /api/medicine/create
  ├─ POST /api/medicine/verify
  └─ GET /api/medicine/:id
  
  server/controllers/medicineController.js
  └─ Business logic
  
  server/services/geminiService.js
  └─ AI analysis
  
Database:
  medicine_profiles table
  └─ Store medicine records
```

### **Profile Picture Upload**
```
Frontend:
  src/pages/ProfilePage.tsx
  └─ Image upload input
  └─ Base64 encoding
  
Backend:
  server/routes/authRoutes.js
  ├─ POST /api/profile/upload-picture
  └─ Receives base64, stores in DB
  
  server/helpers/userHelpers.js
  └─ Database update logic
  
Database:
  users table
  ├─ profile_picture column (TEXT)
  └─ Stores base64 image
```

---

## 📊 Simple Data Flow Examples

### **Example 1: User Login**
```
1. User enters email + password → Frontend
2. Frontend sends POST /api/login → Backend
3. Backend validates credentials → Database (users table)
4. Backend returns JWT token → Frontend
5. Frontend stores token in localStorage
6. Frontend redirects to dashboard based on role
```

### **Example 2: Medicine Verification with AI**
```
1. User searches medicine → Frontend
2. Frontend sends POST /api/medicine/verify → Backend
3. Backend queries database → medicine_profiles table
4. Backend returns medicine info → Frontend
5. User submits patient data → Frontend
6. Frontend sends POST /api/ai/medicine-suggestion → Backend
7. Backend calls Google Gemini API → Analyzes data
8. Gemini returns AI suggestion → Backend
9. Backend returns to Frontend → Shows with timestamp
```

### **Example 3: Certificate Upload**
```
1. User selects certificate image → Frontend
2. Frontend converts to base64 → JavaScript FileReader
3. Frontend sends POST /api/ai/analyze-certificate → Backend
4. Backend extracts base64 → Calls Gemini Vision API
5. Gemini analyzes image → Extracts text, scores authenticity
6. Backend returns analysis → Frontend shows results
7. User saves certificate → Backend stores in database
```

---

## 🎨 4 User Roles Explained

### **EDUCATION Role**
```
Frontend: EducationDashboard.tsx
Backend: educationRoutes.js, educationController.js
Database: educational_profiles table
Features:
  ├─ Create certificates
  ├─ Verify student records
  ├─ Generate QR codes
  └─ Upload institution logo
```

### **MEDICINE Role**
```
Frontend: MedicineDashboard.tsx, VerifyMedicine.tsx
Backend: medicineRoutes.js, medicineController.js
Database: medicine_profiles table
Features:
  ├─ Register medicines
  ├─ Verify authenticity
  ├─ AI suggestions
  └─ Batch tracking
```

### **TUTORIALS Role**
```
Frontend: TutorialDashboard.tsx
Backend: tutorialRoutes.js, tutorialController.js
Database: tutorial_profiles table
Features:
  ├─ Create courses
  ├─ Issue certificates
  ├─ Track completion
  └─ Grade management
```

### **PERSONAL Role**
```
Frontend: PersonalDashboard.tsx
Backend: personalized routes
Database: users table directly (no separate profile table)
Features:
  ├─ View history
  ├─ Manage profile
  ├─ Save preferences
  └─ View documents
```

---

## 🚀 How to Explain Each Component

### **When Explaining Frontend**
1. **Start with**: "React is the UI framework - what users see"
2. **Show**: How pages are organized in `/src/pages/`
3. **Explain**: Components are reusable UI pieces
4. **Highlight**: Vite makes development fast with hot reload
5. **Point out**: TypeScript catches errors before runtime

### **When Explaining Backend**
1. **Start with**: "Express is the server framework"
2. **Show**: API routes handle requests
3. **Explain**: Controllers contain business logic
4. **Highlight**: Services connect to external APIs (Gemini)
5. **Point out**: .env stores sensitive configuration

### **When Explaining Database**
1. **Start with**: "MySQL stores all data persistently"
2. **Show**: Users table structure
3. **Explain**: Role-specific tables (education, medicine, tutorial)
4. **Highlight**: Relationships between tables
5. **Point out**: Migrations allow safe schema updates

### **When Explaining AI Integration**
1. **Start with**: "Gemini API provides intelligent analysis"
2. **Show**: Three main features (certificate, medicine, suggestions)
3. **Explain**: How images are sent as base64
4. **Highlight**: Response formatting and error handling
5. **Point out**: Free tier has 20 requests/day limit

---

## 📋 Complete File Checklist

### Frontend Files
- [ ] `src/App.tsx` - Main app with routes
- [ ] `src/main.tsx` - Entry point
- [ ] `src/pages/LoginPage.tsx` - Login screen
- [ ] `src/pages/MedicineDashboard.tsx` - Medicine verification
- [ ] `src/pages/EducationDashboard.tsx` - Education verification
- [ ] `src/pages/ProfilePage.tsx` - Profile management
- [ ] `src/components/Sidebar.tsx` - Navigation
- [ ] `src/services/api.ts` - API calls
- [ ] `src/contexts/AuthContext.tsx` - Global auth state

### Backend Files
- [ ] `server/index.js` - Server setup
- [ ] `server/routes/authRoutes.js` - Auth endpoints
- [ ] `server/routes/medicineRoutes.js` - Medicine endpoints
- [ ] `server/routes/aiRoutes.js` - AI endpoints
- [ ] `server/controllers/medicineController.js` - Logic
- [ ] `server/services/geminiService.js` - AI integration
- [ ] `server/helpers/userHelpers.js` - DB helpers
- [ ] `server/.env` - Configuration
- [ ] `server/package.json` - Dependencies

### Database Files
- [ ] `database/schema.sql` - Table definitions
- [ ] `database/sample_data.sql` - Sample data
- [ ] `database/migrations/add_profile_features.sql` - Updates

### Documentation
- [ ] `README.md` - Project overview
- [ ] `FINAL_REPORT.md` - Technical report
- [ ] `PRESENTATION_GUIDE.md` - Presentation outline
- [ ] `API_SETUP_GUIDE.md` - API reference
- [ ] `GEMINI_AI_GUIDE.md` - AI guide
- [ ] `DATABASE_README.md` - Database guide

---

## 🎬 How to Present This Structure

**Opening Statement:**
> "ASURE is organized into 4 main sections: Frontend (what users see), Backend (the logic), Database (data storage), and Documentation (guides). Let me walk you through each..."

**Frontend Section (2 minutes):**
> "The frontend is React with TypeScript. Users interact with pages like LoginPage, MedicineDashboard, and ProfilePage. These pages use components for reusable pieces and services to call the backend API."

**Backend Section (2 minutes):**
> "The backend is Express.js. It has routes that handle API requests, controllers with business logic, services for external APIs like Gemini, and helpers for database operations."

**Database Section (1 minute):**
> "We use MySQL to store users, certificates, and medicines. Each role (Education, Medicine, Tutorial, Personal) has its own profile table for specific data."

**Integration (1 minute):**
> "Everything connects: Frontend calls Backend API → Backend processes and queries Database → Returns data to Frontend. Plus, Backend calls Google Gemini API for AI features."

---

## ✅ Summary Table

| Layer | Technology | Location | Purpose |
|-------|-----------|----------|---------|
| **Frontend** | React + TypeScript + Vite | `/src/` or `/frontend/src/` | User interface |
| **Backend** | Node.js + Express | `/server/` | Business logic & APIs |
| **Database** | MySQL | `/database/` | Data persistence |
| **AI** | Google Gemini API | `server/services/` | Intelligent analysis |
| **Config** | .env, package.json | Root & `/server/` | Settings & dependencies |
| **Docs** | Markdown files | Root directory | Guides & references |

---

**Created**: December 8, 2025  
**Purpose**: Easy explanation of project structure  
**Use**: Print or reference during project defense  

