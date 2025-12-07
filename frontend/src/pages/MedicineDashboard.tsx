import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, clearToken } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BigActionButton from "../components/BigActionButton";
import BackButton from "../components/BackButton";
import "./Dashboard.css";

const MedicineDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setLoading(false);
        // Ensure user is medicine company (backend uses MEDICINE)
        const role = data.user?.role?.toUpperCase();
        if (role !== "MEDICINE") {
          navigate("/home");
        }
      })
      .catch(() => {
        clearToken();
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-main">
        <StatusBar title="Medicine Company Dashboard" />

        <div className="home-content">
          <h2 className="home-title">Medicine Company Actions</h2>
          <p className="text-center mb-4">
            Welcome,{" "}
            {user?.profile?.companyName || user?.auth?.email || "Company"}!
          </p>

          <div className="verification-grid">
            <BigActionButton
              title="Verify Medicine"
              subtitle="Verify medicine authenticity"
              icon="🔍"
              onClick={() => navigate("/verify-medicine")}
            />

            <BigActionButton
              title="Enter New Medicine"
              subtitle="Add a new medicine to the database"
              icon="💊"
              onClick={() => navigate("/enter-medicine")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDashboard;
