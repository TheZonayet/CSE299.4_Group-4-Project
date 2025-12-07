## 🚀 QUICK START GUIDE

### Project Structure

```
CSE299.4_Group-4-Project/
├── frontend/              # React + Vite Application (Port 5173)
├── backend/               # Node.js + Express API (Port 4000)
├── database/              # SQL schemas
├── start-frontend.ps1     # ⭐ Start frontend only
├── start-backend.ps1      # ⭐ Start backend only
└── start-both.ps1         # ⭐ Start both servers
```

### Starting the Application

#### Method 1: PowerShell Scripts (Easiest)

```powershell
# Start both servers in separate windows
.\start-both.ps1

# OR start individually
.\start-frontend.ps1
.\start-backend.ps1
```

#### Method 2: NPM Commands

```powershell
# From root directory
npm run frontend     # Start frontend only
npm run backend      # Start backend only
npm run start:both   # Start both

# OR navigate to specific folder
cd frontend
npm run dev

cd backend
npm start
```

#### Method 3: Manual Start

```powershell
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

### First Time Setup

```powershell
# Install all dependencies at once
npm run install:all

# OR install separately
cd frontend
npm install

cd backend
npm install
```

### Environment Configuration

**Backend** (.env in backend/ folder):

```env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=asure
JWT_SECRET=asure_token
GEMINI_API_KEY=AIzaSyB2v-pblflRQdAtmuk8aySAyZ9hE0vdrBI
```

### Features

✅ Completely separate frontend and backend
✅ Can run independently or together
✅ Separate PowerShell windows for each server
✅ Easy debugging with isolated logs
✅ Ready for separate deployment

### Troubleshooting

**Port already in use?**

```powershell
# Stop all node processes
Stop-Process -Name "node" -Force
```

**Frontend not loading?**

- Check it's running on the correct port (5173 or 5174)
- Ensure backend is running on port 4000

**Backend errors?**

- Check MongoDB is running
- Verify .env file exists in backend/

### Development Workflow

1. **Start both servers**: `.\start-both.ps1`
2. **Open browser**: http://localhost:5173
3. **Check logs**: Look at the PowerShell windows
4. **Make changes**:
   - Frontend changes auto-reload (Vite HMR)
   - Backend changes require restart

### Deployment Options

**Frontend**: Can deploy to Vercel, Netlify, Azure Static Web Apps
**Backend**: Can deploy to Heroku, Railway, Azure App Service, AWS EC2

Both can be deployed to different servers and connected via CORS!
