# CSE299.4_Group-4-Project

**Project Name: Asure**

**Simulated Blockchain-based Verification System**

## Description

Asure solves real-world authenticity problems: certificate verification, medicine authenticity, and product legitimacy. Issuers (educational institutes, tutorial institutes, medicine companies) register and publish verified records. Each asset links to a QR code and can be validated via on-chain logic (future scope). Current stack builds a secure off-chain backed API layer ready for blockchain integration.

Tech Stack: Solidity (planned), React.js (Vite), Node.js + Express, MongoDB, HTML/CSS/Bootstrap.

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
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=asure
PORT=4000
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=2h
```

Change `JWT_SECRET` to a long random value in production.

## API Endpoints (Implemented)

- `POST /api/register` – role-specific registration.
- `POST /api/login` – returns `{ user, token }`.
- `GET /api/me` – requires `Authorization: Bearer <token>`.
- `GET /api/ping` – health check.

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
