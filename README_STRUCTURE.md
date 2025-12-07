# ASURE Project Structure

## Folder Organization

```
CSE299.4_Group-4-Project/
├── frontend/              # React + Vite Frontend Application
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── index.html        # Entry HTML
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
│
├── backend/              # Node.js + Express Backend API
│   ├── controllers/      # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic (Gemini AI)
│   ├── db.js            # Database connection
│   ├── index.js         # Server entry point
│   ├── .env             # Environment variables
│   └── package.json     # Backend dependencies
│
├── database/            # Database schemas and seeds
│   ├── schema.sql
│   └── sample_data.sql
│
├── start-frontend.ps1   # Start frontend only
├── start-backend.ps1    # Start backend only
└── start-both.ps1       # Start both servers
```

## Starting the Application

### Option 1: Start Both Servers Together

```powershell
.\start-both.ps1
```

This opens two PowerShell windows:

- Backend on http://localhost:4000
- Frontend on http://localhost:5173

### Option 2: Start Frontend Only

```powershell
.\start-frontend.ps1
```

or

```powershell
cd frontend
npm run dev
```

### Option 3: Start Backend Only

```powershell
.\start-backend.ps1
```

or

```powershell
cd backend
npm start
```

## First Time Setup

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

### Backend Setup

```powershell
cd backend
npm install
npm start
```

## Environment Variables

### Backend (.env in backend/)

```
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=asure
JWT_SECRET=asure_token
GEMINI_API_KEY=your_api_key_here
```

### Frontend (if needed)

Create `.env` in frontend/ folder for API endpoint:

```
VITE_API_URL=http://localhost:4000
```

## Key Features

- **Separate Development**: Work on frontend/backend independently
- **Independent Deployment**: Deploy frontend and backend to different servers
- **Parallel Start**: Run both servers simultaneously with one command
- **Clean Structure**: Clear separation of concerns
