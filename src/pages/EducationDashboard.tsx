import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, clearToken } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BigActionButton from "../components/BigActionButton";
import BackButton from "../components/BackButton";
import "./Dashboard.css";

const EducationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setLoading(false);
        // Ensure user is educational institute (backend uses EDUCATION)
        const role = data.user?.role?.toUpperCase();
        if (role !== "EDUCATION") {
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
        <StatusBar title="Educational Institute Dashboard" />
        <div className="d-flex justify-content-end p-3">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="home-content">
          <h2 className="home-title">Educational Institute Actions</h2>
          <p className="text-center mb-4">
            Welcome,{" "}
            {user?.profile?.instituteName || user?.auth?.email || "Institute"}!
          </p>

          <div className="verification-grid">
            <BigActionButton
              title="Verify Certificate"
              subtitle="Verify educational certificates"
              icon="🔍"
              onClick={() => navigate("/verify-education")}
            />

            <BigActionButton
              title="Enter New Certificate"
              subtitle="Add a new certificate to the database"
              icon="📝"
              onClick={() => navigate("/enter-certificate")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;
