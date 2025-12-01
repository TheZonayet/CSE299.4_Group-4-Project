# CSE299.4_Group-4-Project

**Project Name: Asure**

**Simulated Blockchain-based Verification System with AI Integration**

## Description

Asure solves real-world authenticity problems: certificate verification, medicine authenticity, and product legitimacy. Issuers (educational institutes, tutorial institutes, medicine companies) register and publish verified records. Each asset links to a QR code and can be validated via on-chain logic (future scope). Current stack builds a secure off-chain backed API layer ready for blockchain integration.

**NEW**: Now powered by **Google Gemini AI** for intelligent document analysis, medicine suggestions, and automated verification assistance.

Tech Stack: React.js (Vite), Node.js + Express, MongoDB/MySQL, Google Gemini AI, HTML/CSS/Bootstrap.

## 🤖 AI Features

- **Medicine AI Suggestions**: Personalized recommendations based on patient data, drug interactions, dosage calculations
- **Certificate Image Analysis**: OCR and authenticity verification for educational and tutorial certificates
- **Medicine Image Analysis**: Package recognition, expiry date extraction, counterfeit detection
- **Smart Verification**: AI-powered document scanning and data extraction

📖 **[Complete AI Integration Guide](GEMINI_AI_GUIDE.md)**

## Current Backend Auth Model

Users stored with role-specific profile fields and an `auth` object:

```jsonc
{
  "id": "uuid",
  "role": "EDUCATION | PERSONAL | TUTORIALS | MEDICINE",
  "auth": { "email": "string", "passwordHash": "bcrypt" },
  "profile": {
    /* role-specific fields */
  },
  "verificationCredits": 100,
  "createdAt": "ISO date"
}
```

### Role Registration Fields

- EDUCATION: `instituteName`, `officialPhone`, `eiinNumber`, `officialEmail`, `password`, `confirmPassword`
- PERSONAL: `email`, `password`, `confirmPassword`
- TUTORIALS: `instituteName`, `officialPhone`, `govtLicenseNumber`, `officialEmail`, `password`, `confirmPassword`
- MEDICINE: `companyName`, `officialPhone`, `govtLicenseNumber`, `officialEmail`, `password`, `confirmPassword`

Login uses role + email field (PERSONAL uses `email`, others use `officialEmail`) + password.

## Environment Variables (`server/.env`)

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=2h

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB (Currently Active)
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=asure

# XAMPP MySQL (Alternative)
# DB_TYPE=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=asure_verification_db
```

**Important**:

- Change `JWT_SECRET` to a long random value in production
- Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## API Endpoints (Implemented)

### Authentication

- `POST /api/register` – role-specific registration
- `POST /api/login` – returns `{ user, token }`
- `GET /api/me` – get current user (requires auth)
- `GET /api/profile` – get user profile
- `PUT /api/profile` – update user profile

### Domain-Specific Verification

- `POST /api/education/create` – add educational certificate
- `POST /api/education/verify` – verify certificate by rollNumber & instituteId
- `POST /api/medicine/create` – add medicine record
- `POST /api/medicine/verify` – verify medicine by name or code
- `POST /api/tutorial/create` – add tutorial certificate
- `POST /api/tutorial/verify` – verify tutorial certificate by ID

### AI-Powered Features 🤖

- `POST /api/ai/medicine-suggestion` – get personalized medicine recommendations
- `POST /api/ai/analyze-certificate` – AI-powered certificate image analysis
- `POST /api/ai/analyze-medicine` – AI-powered medicine image analysis
- `POST /api/ai/assist` – general AI assistance

### Verification History

- `POST /api/verify` – create verification record
- `GET /api/verification-history` – get user's verification history
- `GET /api/verification-limits` – get remaining credits

## Planned Endpoints (Next)

- `GET /api/profile`, `PUT /api/profile`
- `POST /api/verify` – create verification record, decrement credits.
- `GET /api/verification-history`
- `GET /api/verification-limits`

## Frontend (Upcoming Work)

Implement React Router pages: Login, Register, Home (verification actions), Profile, History. Add reusable components: Sidebar, StatusBar, BackButton, BigActionButton.

## Setup

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (root)
npm install
npm run dev
```

## Security Notes

- Replace default `JWT_SECRET`.
- Consider enabling HTTPS and CORS origin restrictions.
- Future: integrate blockchain writes + signature verification / QR code hashing.

## Future Features (Blockchain Scope)

- NFT minting of certificates.
- Multi-signature approval flows.
- Tamper detection & crowd reporting.
- Geo-verification analytics & AI forgery scan.

This README reflects the updated authentication layer and environment configuration.
