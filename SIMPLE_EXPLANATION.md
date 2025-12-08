# ASURE - Quick Reference Guide
## Easy Explanations for Each Component

---

## 📱 FRONTEND EXPLAINED

### What is it?
The **Frontend** is everything users see and interact with on the website.

### Technology Used
- **React 19.1** - Framework for building interactive UI
- **TypeScript** - Makes JavaScript safer with type checking
- **Vite** - Super fast build tool (dev server on port 5173)
- **Bootstrap 5.3** - Ready-made styling components
- **Tailwind CSS** - Custom styling utility

### Key Files to Know
```
src/
├── App.tsx                 - Main file with all routes/pages
├── main.tsx                - Starts the app
├── pages/                  - Full screens (LoginPage, Dashboard, etc.)
├── components/             - Reusable pieces (Sidebar, Button, etc.)
├── services/api.ts         - Sends/receives data from backend
├── features/auth/          - Login/registration logic
└── contexts/AuthContext.tsx- Stores user login info globally
```

### How It Works
1. User opens browser → Loads React app
2. React shows Login page
3. User logs in → Frontend sends email+password to backend
4. Backend returns token → Frontend stores in localStorage
5. Frontend shows Dashboard based on user role
6. User interacts with features → Frontend calls backend APIs

### The 3 Main Screens Users See
1. **Login/Register Page** - Entry point
2. **Dashboard** - Main area (different per role)
3. **Verification Pages** - Certificate/Medicine verification
4. **Profile Page** - User profile with picture upload

---

## 🔌 BACKEND EXPLAINED

### What is it?
The **Backend** is the server that processes requests and manages data.

### Technology Used
- **Node.js** - JavaScript runtime on server (not browser)
- **Express.js** - Framework for creating API endpoints
- **MySQL** - Database for storing data
- **Google Gemini API** - AI for analysis
- **JWT** - Token-based authentication

### Key Files to Know
```
server/
├── index.js                    - Starts Express server (port 4000)
├── routes/                     - API endpoints (/api/login, /api/medicine/verify, etc.)
│   ├── authRoutes.js          - Login/Register endpoints
│   ├── medicineRoutes.js      - Medicine endpoints
│   ├── aiRoutes.js            - AI endpoints
│   └── educationRoutes.js     - Education endpoints
├── controllers/               - Business logic (what each endpoint does)
│   └── medicineController.js  - Handles medicine requests
├── services/
│   └── geminiService.js       - Calls Google Gemini API
├── helpers/
│   └── userHelpers.js         - Database query functions
└── .env                       - Stores secrets (API keys, DB password)
```

### How It Works
1. Frontend sends request → `POST /api/medicine/verify`
2. Backend receives request in medicineRoutes.js
3. Routes file calls medicineController.js
4. Controller validates data and queries database
5. If AI needed, calls geminiService.js
6. geminiService calls Google Gemini API
7. Response flows back: Gemini → Service → Controller → Routes → Frontend

### API Endpoints (What Backend Offers)

**Authentication**
- `POST /api/register` - Create new user
- `POST /api/login` - User login
- `GET /api/me` - Get current user
- `POST /api/profile/upload-picture` - Upload profile pic

**Verification**
- `POST /api/medicine/create` - Register medicine
- `POST /api/medicine/verify` - Check if medicine is authentic
- `POST /api/education/create` - Register certificate
- `GET /api/education/verify` - Verify certificate

**AI Features**
- `POST /api/ai/medicine-suggestion` - Get personalized medicine recommendation
- `POST /api/ai/analyze-certificate` - Analyze certificate image
- `POST /api/ai/analyze-medicine` - Analyze medicine package image

---

## 🗄️ DATABASE EXPLAINED

### What is it?
The **Database** is where all data is permanently stored (like a digital filing cabinet).

### Technology Used
- **MySQL** - Relational database
- **Running on**: localhost:3306
- **Database name**: asure_verification_db
- **Connection**: No password required (for development)

### Main Tables

**1. users Table**
```
What it stores: All user accounts
Columns:
├── id           - Unique identifier
├── role         - User type (EDUCATION, MEDICINE, TUTORIALS, PERSONAL)
├── email        - Login email
├── password_hash- Encrypted password
├── name         - User's name
├── profile_picture- Base64 encoded image
└── verification_credits- Number of verifications allowed
```

**2. educational_profiles Table**
```
What it stores: Education institution details
Columns:
├── userId       - Links to users table
├── instituteName- Name of school/college
├── eiinNumber   - Registration number
├── officialEmail- Institution email
└── officialPhone- Institution phone
```

**3. medicine_profiles Table**
```
What it stores: Medicine company details
Columns:
├── userId       - Links to users table
├── companyName  - Pharmaceutical company
├── govtLicenseNumber- License
├── officialEmail- Company email
└── officialPhone- Company phone
```

**4. tutorial_profiles Table**
```
What it stores: Tutorial center details
Columns:
├── userId       - Links to users table
├── instituteName- Tuition center name
├── govtLicenseNumber- License
├── officialEmail- Center email
└── officialPhone- Center phone
```

### How Data Flows
1. User registers → Data saved to `users` table
2. User selects role → Data saved to role-specific table (medicine_profiles, etc.)
3. User uploads certificate → Data saved to database
4. User searches certificate → Backend queries database, returns result
5. User verifies medicine → Backend queries database + calls AI, returns result

---

## 🤖 AI INTEGRATION EXPLAINED

### What is it?
**Google Gemini** is an AI service that analyzes documents and provides recommendations.

### How It Works
1. **Text-Based AI** (for medicine suggestions)
   - Takes medicine info + patient data
   - Sends to Gemini
   - Gets back personalized dosage & recommendations

2. **Vision AI** (for image analysis)
   - User uploads certificate/medicine image
   - Converts to base64
   - Sends to Gemini Vision API
   - Gets back text extraction & authenticity score

### Three Main AI Features
```
1. Medicine Suggestions
   Input: Medicine name + patient age/weight/conditions
   Output: "Patient requires 250mg every 4-6 hours..."
   
2. Certificate Analysis
   Input: Certificate image
   Output: "Name: John, Grade: A, Score: 85/100"
   
3. Medicine Image Recognition
   Input: Medicine package image
   Output: "Batch: 379L, Expiry: 04-21, Safety: 90/100"
```

### Configuration
```
File: server/.env
Variable: GEMINI_API_KEY=AIzaSyCjuDD_uiaCLS5RN6sQG5DDgNDZ5V6ATU0

Limits:
├─ Free tier: 20 requests/day
├─ Paid tier: 1000+ requests/day
└─ Model: Gemini 2.5 Flash
```

---

## 🔐 Authentication (Login) Explained

### Simple Flow
```
1. User enters email + password
         ↓
2. Frontend sends to backend
         ↓
3. Backend checks database (users table)
         ↓
4. If correct:
   - Creates JWT token
   - Sends back to frontend
   ↓
5. Frontend saves token in browser storage
         ↓
6. For next request, adds token to header
         ↓
7. Backend checks token = user verified
```

### What is JWT?
A **JWT (JSON Web Token)** is like a digital ID card:
- Created when user logs in
- Expires after 2 hours
- Proves user is authenticated
- Sent with every request

### Role-Based Access
```
User Role          Dashboard           Features
─────────────────────────────────────────────────────
EDUCATION    →  Education Dashboard  → Create certificates
MEDICINE     →  Medicine Dashboard   → Verify medicines
TUTORIALS    →  Tutorial Dashboard   → Create courses
PERSONAL     →  Personal Profile     → Manage profile
```

---

## 🎯 Feature Examples

### Feature 1: Profile Picture Upload
```
User uploads photo:
1. Frontend: Read image file
2. Frontend: Convert to base64 string
3. Frontend: Send base64 to POST /api/profile/upload-picture
4. Backend: Receive base64 string
5. Database: Store in users.profile_picture column
6. Frontend: Display profile picture

Where it's used:
├─ Dashboard header
├─ Profile page
└─ User info display
```

### Feature 2: Medicine Verification
```
User searches medicine:
1. Frontend: User types medicine name
2. Frontend: Send POST /api/medicine/verify
3. Backend: Query medicine_profiles table
4. Database: Find matching medicine
5. Backend: Return medicine details
6. Frontend: Display "Authentic ✓" with details

Optional AI Analysis:
1. User enters patient data (age, weight, conditions)
2. Frontend: Send POST /api/ai/medicine-suggestion
3. Backend: Call geminiService.js
4. AI: Analyze and generate recommendations
5. Backend: Return to frontend
6. Frontend: Display with timestamp
```

### Feature 3: Certificate Verification
```
User uploads certificate image:
1. Frontend: Select certificate image (PNG)
2. Frontend: Convert image to base64
3. Frontend: Send POST /api/ai/analyze-certificate
4. Backend: Extract base64
5. Backend: Call Gemini Vision API
6. AI: Analyze and extract text
7. Backend: Return analysis
8. Frontend: Show "Certificate Details" with authenticity score
9. User: Click Save Certificate
10. Backend: Store to database
```

---

## 📊 Technology Stack at a Glance

| Layer | What | Why | Port |
|-------|------|-----|------|
| Frontend | React + TypeScript | Fast, type-safe UI | 5173 |
| Backend | Node.js + Express | Fast, scalable server | 4000 |
| Database | MySQL | Reliable data storage | 3306 |
| AI | Google Gemini | Smart analysis | API |
| Auth | JWT | Secure token-based | - |

---

## 🚀 How to Explain to Non-Technical People

**Simple Analogy:**
> "ASURE is like a government office for verifying documents.
> 
> - **Frontend** is the waiting room where people fill out forms
> - **Backend** is the office workers who check the documents
> - **Database** is the filing cabinet where records are kept
> - **AI** is like an expert who verifies authenticity
> 
> When someone wants to verify a certificate, they go through the waiting room (frontend), fill out a form, submit it to an office worker (backend), who checks the files (database) and might ask an expert (AI) for advice, then gives back the result to the person."

---

## 🎓 How to Explain During Defense

### Opening
"ASURE is organized into 4 main components: Frontend, Backend, Database, and AI. Let me explain what each does."

### Frontend (30 seconds)
"The Frontend is React. It's what users see on their browser. Users log in, see their dashboard, verify medicines or certificates. It's responsive and works on mobile and desktop."

### Backend (30 seconds)
"The Backend is Express.js running on Node.js. It receives requests from the frontend, processes them, queries the database, and might call the AI service. It also handles authentication with JWT tokens."

### Database (20 seconds)
"We use MySQL to store all data. We have a users table for login info, and separate tables for each role (education, medicine, tutorials). Everything is linked properly."

### AI (20 seconds)
"We integrated Google Gemini API for smart analysis. It can analyze medicine packages, verify certificates, and provide personalized medical recommendations based on patient data."

### Integration (20 seconds)
"All parts work together: When a user verifies a medicine, the frontend sends a request to the backend, which queries the database and calls AI, then returns the result to the frontend which displays it beautifully."

---

## ✅ Ready to Explain?

Print this document and keep it handy during your defense!

Key points to remember:
1. Frontend = UI (what users see)
2. Backend = Logic (what happens behind scenes)
3. Database = Storage (permanent data)
4. AI = Intelligence (analysis & suggestions)

You can draw this simple diagram while explaining:
```
User → Frontend → Backend → Database
                   ↓
              Google Gemini API
```

---

**Created**: December 8, 2025  
**Purpose**: Easy explanation reference  
**Use**: During project defense presentation  

