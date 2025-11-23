import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./features/auth/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import VerifyEducation from "./pages/VerifyEducation";
import VerifyMedicine from "./pages/VerifyMedicine";
import VerifyProduct from "./pages/VerifyProduct";
import VerifyTutorial from "./pages/VerifyTutorial";
import EducationDashboard from "./pages/EducationDashboard";
import MedicineDashboard from "./pages/MedicineDashboard";
import TutorialDashboard from "./pages/TutorialDashboard";
import EnterCertificate from "./pages/EnterCertificate";
import EnterMedicine from "./pages/EnterMedicine";
import EnterTutorialCertificate from "./pages/EnterTutorialCertificate";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getToken } from "./services/api";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              getToken() ? <Navigate to="/home" replace /> : <LoginPage />
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education-dashboard"
            element={
              <ProtectedRoute>
                <EducationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicine-dashboard"
            element={
              <ProtectedRoute>
                <MedicineDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutorial-dashboard"
            element={
              <ProtectedRoute>
                <TutorialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enter-certificate"
            element={
              <ProtectedRoute>
                <EnterCertificate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enter-medicine"
            element={
              <ProtectedRoute>
                <EnterMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enter-tutorial-certificate"
            element={
              <ProtectedRoute>
                <EnterTutorialCertificate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-education"
            element={
              <ProtectedRoute>
                <VerifyEducation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-medicine"
            element={
              <ProtectedRoute>
                <VerifyMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-product"
            element={
              <ProtectedRoute>
                <VerifyProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-tutorial"
            element={
              <ProtectedRoute>
                <VerifyTutorial />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
