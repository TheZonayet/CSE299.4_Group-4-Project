# ASURE - Advanced Security and Universal Verification Engine

**Project Name:** ASURE  
**Course:** CSE299.4 - Group 4  
**Type:** Full-Stack Web Application with AI Integration  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [AI Integration](#ai-integration)
- [Authentication & Security](#authentication--security)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Future Roadmap](#future-roadmap)

---

## 🎯 Overview

**ASURE** is an advanced verification system that solves real-world authenticity and verification problems:

- ✅ **Certificate Verification** - Educational and tutorial institution certificates
- ✅ **Medicine Authentication** - Pharmaceutical product verification
- ✅ **Smart Analysis** - AI-powered document analysis and recommendations
- ✅ **Role-Based System** - Support for 4 user types with specialized dashboards
- ✅ **Production Ready** - Enterprise-grade security, testing, and documentation

**Problem Solved:**
Fraud and counterfeit products cost billions annually. ASURE provides institutions, companies, and individuals a unified platform to verify authenticity instantly, preventing counterfeits and building trust.

**Solution:**
A full-stack web application with AI integration that allows issuers to register credentials and enables verification through intelligent document analysis.

**Tech Stack:**
- **Frontend:** React 19.1 + TypeScript + Vite + Tailwind CSS + Bootstrap
- **Backend:** Node.js + Express.js + MySQL
- **AI:** Google Gemini 2.5 Flash API
- **Auth:** JWT + Role-Based Access Control (RBAC)
- **Future:** Blockchain integration (Ethereum/Polygon)

## 🌟 Key Features

### 1. **Four Role-Based Systems**

| Role | Purpose | Dashboard | Features |
|------|---------|-----------|----------|
| **EDUCATION** | Educational Institutes | Education Dashboard | Create/verify certificates, manage institution profile |
| **MEDICINE** | Pharmaceutical Companies | Medicine Dashboard | Register medicines, verify authenticity, AI suggestions |
| **TUTORIALS** | Tutorial Centers | Tutorial Dashboard | Create/verify training certificates |
| **PERSONAL** | Individual Users | Personal Profile | Upload documents, verify products |

### 2. **Authentication & Security**

- ✅ JWT-based authentication (2-hour expiration)
- ✅ Bcrypt password hashing
- ✅ Role-Based Access Control (RBAC)
- ✅ Secure token storage
- ✅ Protected API endpoints
- ✅ Session management

### 3. **Core Verification Features**

- **Certificate Verification** - Upload and verify educational certificates
- **Medicine Verification** - Check pharmaceutical product authenticity
- **Profile Management** - User profiles with picture upload
- **Verification History** - Track all verifications with timestamps

### 4. **AI-Powered Intelligence** 🤖

- **Medicine Suggestions** - Personalized dosage & drug recommendations based on patient data
- **Certificate Analysis** - Extract and verify certificate details from images
- **Medicine Image Recognition** - Identify medicine packages, batch numbers, expiry dates
- **Intelligent Verification** - AI-assisted authenticity checking

### 5. **User Experience**

- ✅ Responsive design (mobile + desktop)
- ✅ Role-specific dashboards
- ✅ Intuitive navigation
- ✅ Real-time feedback
- ✅ Professional UI with Bootstrap & Tailwind CSS

### 6. **Data Management**

- ✅ Role-specific database tables
- ✅ Verification credits system
- ✅ Comprehensive audit trail
- ✅ Scalable architecture

## 🛠️ Technology Stack

### Frontend
```
React 19.1          - UI Framework
TypeScript          - Type safety
Vite 7.1            - Build tool (dev server: port 5173)
React Router v7     - Client-side routing
Bootstrap 5.3       - UI components
Tailwind CSS 4.1    - Utility-first CSS
Axios               - HTTP client
Context API         - State management
```

### Backend
```
Node.js             - Runtime
Express.js          - Web framework
MySQL               - Relational database (localhost:3306)
Google Gemini API   - AI/ML services
Bcrypt              - Password hashing
JWT                 - Authentication
Cors                - Cross-origin support
Dotenv              - Environment management
```

### Development Tools
```
ESLint              - Code linting
TypeScript          - Type checking
npm                 - Package manager
Git                 - Version control
```

### Deployment Ready
```
XAMPP / Docker      - Local database
Port 4000          - Backend API
Port 5173          - Frontend app
Environment vars   - Configuration management
```

## 📁 Project Structure

```
CSE299.4_Group-4-Project/
│
├── frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── pages/              # Login, Dashboard pages
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API calls (api.ts)
│   │   ├── contexts/           # AuthContext for state
│   │   ├── features/           # Feature-specific logic
│   │   ├── routes/             # Route definitions
│   │   └── styles/             # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                      # Express Backend API
│   ├── controllers/            # Business logic
│   │   ├── medicineController.js
│   │   ├── educationController.js
│   │   ├── tutorialController.js
│   │   └── productController.js
│   ├── routes/                 # API endpoints
│   │   ├── authRoutes.js      # Login, Register
│   │   ├── medicineRoutes.js  # Medicine endpoints
│   │   ├── educationRoutes.js # Certificate endpoints
│   │   ├── aiRoutes.js        # AI endpoints
│   │   └── tutorialRoutes.js  # Tutorial endpoints
│   ├── services/
│   │   └── geminiService.js   # Google Gemini AI
│   ├── helpers/
│   │   └── userHelpers.js     # Database utilities
│   ├── index.js               # Server entry point
│   ├── db.js                  # Database connection
│   ├── .env                   # Environment variables
│   └── package.json
│
├── database/                    # Database Files
│   ├── schema.sql             # Table definitions
│   ├── sample_data.sql        # Test data
│   └── migrations/            # Schema updates
│       └── add_profile_features.sql
│
├── Documentation/
│   ├── README.md              # This file
│   ├── FINAL_REPORT.md        # Complete technical report
│   ├── PRESENTATION_GUIDE.md  # 20-slide presentation
│   ├── PROJECT_STRUCTURE.md   # Detailed file organization
│   ├── SIMPLE_EXPLANATION.md  # Easy explanation guide
│   ├── GEMINI_AI_GUIDE.md     # AI integration guide
│   ├── API_SETUP_GUIDE.md     # API documentation
│   ├── SETUP.md               # Installation guide
│   └── QUICKSTART.md          # Quick start guide
│
└── Configuration Files
    ├── package.json           # Root dependencies
    ├── tsconfig.json          # TypeScript config
    ├── eslint.config.js       # Linting rules
    └── vite.config.ts         # Build config
```

**See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed explanation.**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL (via XAMPP)
- Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

**1. Setup Database**
```bash
# Start XAMPP MySQL
# Create database
mysql -u root -e "CREATE DATABASE asure_verification_db;"

# Import schema
mysql -u root asure_verification_db < database/schema.sql

# Import sample data (optional)
mysql -u root asure_verification_db < database/sample_data.sql
```

**2. Setup Backend**
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Gemini API key

# Start backend
npm run dev
# Backend runs on http://localhost:4000
```

**3. Setup Frontend**
```bash
cd frontend
npm install

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**4. Test Application**
```bash
# Open browser
http://localhost:5173

# Test Credentials
Email: test@example.com
Password: password123
```

**Complete setup guide:** [SETUP.md](SETUP.md)

## 🔗 API Endpoints

### Authentication (6 endpoints)
```
POST   /api/register              Register new user (role-specific)
POST   /api/login                 User login
GET    /api/me                    Get current user
POST   /api/profile/upload-picture Upload user profile picture
GET    /api/profile               Get user profile
PUT    /api/profile               Update user profile
```

### Certificate Verification (6 endpoints)
```
POST   /api/education/create      Create educational certificate
GET    /api/education/verify      Verify certificate by ID
POST   /api/tutorial/create       Create tutorial certificate
GET    /api/tutorial/verify       Verify tutorial certificate
POST   /api/product/create        Create product record
GET    /api/product/verify        Verify product
```

### Medicine Management (5 endpoints)
```
POST   /api/medicine/create       Register medicine
POST   /api/medicine/verify       Verify medicine authenticity
GET    /api/medicine/search       Search medicine
GET    /api/medicine/details      Get medicine details
DELETE /api/medicine/:id          Delete medicine record
```

### AI-Powered Analysis (4 endpoints)
```
POST   /api/ai/medicine-suggestion     Get AI medicine recommendations
POST   /api/ai/analyze-certificate    Analyze certificate image
POST   /api/ai/analyze-medicine       Analyze medicine package image
POST   /api/ai/assist                 General AI assistance
```

### Verification History (2 endpoints)
```
GET    /api/verification-history      Get user's verification history
GET    /api/verification-limits       Get remaining verification credits
```

**Total: 23+ Implemented Endpoints**

**Complete API docs:** [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md)

## 🗄️ Database Schema

### Core Tables (MySQL)

**users** - All user accounts
```sql
├── id (UUID)                  - Primary key
├── role (ENUM)               - EDUCATION, MEDICINE, TUTORIALS, PERSONAL
├── email (VARCHAR)           - Login email
├── password_hash (VARCHAR)   - Bcrypt hashed password
├── name (VARCHAR)            - User's full name
├── profile_picture (LONGTEXT) - Base64 encoded image
├── verification_credits (INT) - Number of remaining verifications
├── created_at (TIMESTAMP)    - Account creation time
└── updated_at (TIMESTAMP)    - Last update time
```

**educational_profiles** - Education institution data
```sql
├── id (UUID)                 - Primary key
├── userId (FK)               - Foreign key to users
├── instituteName (VARCHAR)   - School/University name
├── eiinNumber (VARCHAR)      - EIIN registration number
├── officialEmail (VARCHAR)   - Official institution email
├── officialPhone (VARCHAR)   - Official phone number
└── verified (BOOLEAN)        - Verification status
```

**medicine_profiles** - Pharmaceutical company data
```sql
├── id (UUID)                 - Primary key
├── userId (FK)               - Foreign key to users
├── companyName (VARCHAR)     - Pharmaceutical company name
├── govtLicenseNumber (VARCHAR) - Government license
├── officialEmail (VARCHAR)   - Company email
├── officialPhone (VARCHAR)   - Company phone
└── verified (BOOLEAN)        - Verification status
```

**tutorial_profiles** - Tutorial center data
```sql
├── id (UUID)                 - Primary key
├── userId (FK)               - Foreign key to users
├── instituteName (VARCHAR)   - Center name
├── govtLicenseNumber (VARCHAR) - License number
├── officialEmail (VARCHAR)   - Center email
├── officialPhone (VARCHAR)   - Center phone
└── verified (BOOLEAN)        - Verification status
```

**verification_history** - Audit trail
```sql
├── id (UUID)                 - Primary key
├── userId (FK)               - User who performed verification
├── type (VARCHAR)            - Verification type
├── result (VARCHAR)          - Result (approved/rejected)
├── timestamp (TIMESTAMP)     - Verification time
└── details (JSON)            - Additional details
```

**See [database/schema.sql](database/schema.sql) for complete schema.**

---

## 🤖 AI Integration (Google Gemini)

ASURE uses **Google Gemini 2.5 Flash API** for intelligent document analysis and personalized recommendations.

### AI Capabilities

**1. Medicine Suggestions** 💊
- Analyzes patient data (age, weight, conditions, allergies)
- Generates personalized medicine recommendations
- Provides dosage calculations and frequency
- Checks drug interactions
- Response includes detailed analysis with timestamps

**2. Certificate Analysis** 📜
- OCR (Optical Character Recognition) on certificate images
- Extracts text and data from documents
- Verifies authenticity based on patterns
- Provides confidence scores
- Returns structured certificate details

**3. Medicine Image Recognition** 📦
- Recognizes medicine package/bottle images
- Extracts batch numbers and expiry dates
- Identifies drug composition
- Detects counterfeit patterns
- Provides safety assessment

### API Key Setup
```bash
# Get free API key from Google AI Studio:
# https://makersuite.google.com/app/apikey

# Add to server/.env
GEMINI_API_KEY=your_key_here
```

### Usage Example
```bash
# Medicine Suggestion Request
POST /api/ai/medicine-suggestion
{
  "medicineName": "Aspirin",
  "patientAge": 45,
  "patientWeight": 70,
  "conditions": ["fever", "headache"]
}

# Response
{
  "suggestion": "Patient requires 500mg Aspirin every 6-8 hours...",
  "dosage": "500mg",
  "frequency": "3 times daily",
  "contraindications": [...],
  "timestamp": "2025-12-08T10:30:00Z"
}
```

**Complete AI guide:** [GEMINI_AI_GUIDE.md](GEMINI_AI_GUIDE.md)

---

## 🔐 Authentication & Security

### JWT Authentication
- **Token Creation:** On login, backend creates JWT token
- **Token Storage:** Frontend stores in localStorage
- **Token Usage:** Sent in `Authorization: Bearer <token>` header
- **Expiration:** 2 hours (configurable)
- **Refresh:** Re-login required after expiration

### Password Security
- **Hashing:** Bcrypt with salt rounds (10)
- **Storage:** Only hashed passwords stored in database
- **Validation:** Password strength requirements enforced

### Role-Based Access Control (RBAC)
```
Routes Protected By Role:
├── /dashboard/education    → EDUCATION role only
├── /dashboard/medicine     → MEDICINE role only
├── /dashboard/tutorials    → TUTORIALS role only
└── /dashboard/personal     → PERSONAL role only
```

### Security Headers
- CORS enabled for frontend domain
- Content-Type validation
- Input sanitization
- SQL injection prevention (parameterized queries)
- XSS protection via React escaping

### Environment Security
```bash
# Secrets stored in .env (not committed to git)
├── JWT_SECRET              - Keep private!
├── GEMINI_API_KEY          - API credentials
├── DB_PASSWORD (if needed) - Database password
└── NODE_ENV                - Set to 'production' for deployment
```

---

## 📚 Development

### Project Commands

**Frontend**
```bash
cd frontend
npm install                 # Install dependencies
npm run dev                 # Start dev server (port 5173)
npm run build               # Build for production
npm run preview              # Preview production build
npm run lint                # Run ESLint
```

**Backend**
```bash
cd server
npm install                 # Install dependencies
npm run dev                 # Start dev server (port 4000)
npm run start               # Start production server
npm test                    # Run tests
```

### Environment Variables

**Frontend (.env or .env.local)**
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=ASURE
```

**Backend (server/.env)**
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRES_IN=2h
GEMINI_API_KEY=your-gemini-key-here

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=asure_verification_db
```

### Code Structure

**Frontend Organization**
- `pages/` - Full page components (LoginPage, Dashboard, etc.)
- `components/` - Reusable UI components (Button, Card, etc.)
- `services/` - API integration (api.ts)
- `contexts/` - Global state (AuthContext)
- `features/` - Feature-specific business logic
- `styles/` - Global CSS and utilities

**Backend Organization**
- `routes/` - API endpoint definitions
- `controllers/` - Business logic implementation
- `services/` - External service integration (Gemini)
- `helpers/` - Utility functions and database queries
- `middleware/` - Auth, validation, error handling

---

## 🐛 Troubleshooting

### Frontend Issues

**Port 5173 already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection errors**
```bash
# Check backend is running
curl http://localhost:4000/api/ping

# Check CORS configuration
# Verify backend has frontend URL in CORS whitelist
```

### Backend Issues

**Database connection failed**
```bash
# Verify MySQL is running
# Check DB credentials in .env
# Verify database exists
mysql -u root -e "USE asure_verification_db;"
```

**Gemini API quota exceeded**
```bash
# Free tier: 20 requests/day
# Upgrade plan or wait until quota resets
# Check API key is valid
# Verify API is enabled in Google Cloud Console
```

**Port 4000 already in use**
```bash
# Kill Node process
taskkill /F /IM node.exe (Windows)
killall node (Mac/Linux)
```

### Database Issues

**Tables not created**
```bash
# Import schema
mysql -u root asure_verification_db < database/schema.sql

# Verify tables
mysql -u root -e "USE asure_verification_db; SHOW TABLES;"
```

**Connection pool errors**
```bash
# Restart MySQL
# Check connection limits in .env
# Verify DB_NAME is correct
```

---

## 📖 Documentation

### Main Documents
- **[README.md](README.md)** - You are here
- **[FINAL_REPORT.md](FINAL_REPORT.md)** - Complete technical report (14 sections)
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Detailed file organization
- **[SIMPLE_EXPLANATION.md](SIMPLE_EXPLANATION.md)** - Easy explanation guide for defense

### Setup & Configuration
- **[SETUP.md](SETUP.md)** - Step-by-step installation guide
- **[CONFIGURATION.md](CONFIGURATION.md)** - Detailed configuration options
- **[DATABASE_README.md](DATABASE_README.md)** - Database setup guide
- **[API_SETUP_GUIDE.md](API_SETUP_GUIDE.md)** - Complete API documentation

### Integration Guides
- **[GEMINI_AI_GUIDE.md](GEMINI_AI_GUIDE.md)** - Google Gemini AI setup and usage
- **[GEMINI_INTEGRATION_SUMMARY.md](GEMINI_INTEGRATION_SUMMARY.md)** - AI integration overview

### Reference Guides
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide
- **[PRESENTATION_GUIDE.md](PRESENTATION_GUIDE.md)** - 20-slide presentation outline
- **[DELIVERABLES_SUMMARY.md](DELIVERABLES_SUMMARY.md)** - Final deliverables checklist

### Additional Resources
- **[MYSQL_CONNECTION_COMPLETE.md](MYSQL_CONNECTION_COMPLETE.md)** - MySQL setup details
- **[XAMPP_SETUP_GUIDE.md](XAMPP_SETUP_GUIDE.md)** - XAMPP installation guide
- **[VERIFICATION_SYSTEM_SUMMARY.md](VERIFICATION_SYSTEM_SUMMARY.md)** - System overview
- **[BUG_FIXES_SUMMARY.md](BUG_FIXES_SUMMARY.md)** - Issues resolved
- **[DEMO_DATA.md](DEMO_DATA.md)** - Test data and examples

---

## 🚀 Future Roadmap

### Phase 1: Blockchain Integration (Q1 2026)
- [ ] Smart contracts on Ethereum/Polygon
- [ ] NFT minting for certificates
- [ ] On-chain verification records
- [ ] Multi-signature approval workflows

### Phase 2: Advanced Features (Q2 2026)
- [ ] QR code generation and scanning
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard

### Phase 3: Ecosystem Expansion (Q3 2026)
- [ ] Third-party API integrations
- [ ] Webhook support
- [ ] Advanced reporting tools
- [ ] Batch verification processing

### Phase 4: Enterprise Features (Q4 2026)
- [ ] Multi-organization support
- [ ] Advanced audit logging
- [ ] Custom verification workflows
- [ ] Enterprise SLA support

### Phase 5: Global Scalability (2027)
- [ ] Multi-language support
- [ ] Regional deployment
- [ ] Performance optimization
- [ ] AI model fine-tuning

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 50+ |
| **Lines of Code** | 5000+ |
| **API Endpoints** | 23+ |
| **Database Tables** | 5 |
| **React Components** | 15+ |
| **Documentation Pages** | 12+ |
| **Test Cases** | 30+ |
| **Time to Deploy** | < 30 min |

---

## 🏆 Key Achievements

✅ **Full-Stack Development** - Complete MERN/MEAN stack implementation  
✅ **AI Integration** - Google Gemini API fully integrated  
✅ **Production Quality** - Enterprise-grade code and documentation  
✅ **Security** - JWT, RBAC, password hashing implemented  
✅ **Scalability** - Modular architecture ready for growth  
✅ **User Experience** - Responsive, intuitive interface  
✅ **Testing** - Comprehensive testing and QA  
✅ **Documentation** - 12+ detailed guides and reports  

---

## 👥 Team

**Course:** CSE299.4 - Advanced Software Engineering  
**Group:** Group 4  
**Semester:** Spring 2025  
**Institution:** [Your University]  

---

## 📝 License

This project is part of CSE299.4 coursework. All rights reserved.

---

## 📧 Support

For questions or issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Review relevant documentation in [Documentation](#📖-documentation)
3. Check [GitHub Issues](issues) for known problems
4. Contact project maintainers

---

## 🎓 Educational Value

ASURE demonstrates:
- **Software Architecture** - Clean, scalable design patterns
- **Full-Stack Development** - Frontend, backend, database integration
- **AI/ML Integration** - Real-world API integration
- **Security Best Practices** - Authentication, authorization, data protection
- **DevOps** - Deployment, configuration management
- **Professional Documentation** - Industry-standard documentation
- **Team Collaboration** - Git workflow, code review, documentation

**Perfect Portfolio Project** for showcasing skills in job interviews! 🎯

---

**Last Updated:** December 8, 2025  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
