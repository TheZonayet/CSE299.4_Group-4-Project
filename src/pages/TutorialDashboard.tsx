import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, clearToken } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BigActionButton from "../components/BigActionButton";
import BackButton from "../components/BackButton";
import "./Dashboard.css";

const TutorialDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setLoading(false);
        // Ensure user is tutorial institute (backend uses TUTORIALS)
        const role = data.user?.role?.toUpperCase();
        if (role !== "TUTORIALS") {
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
        <StatusBar title="Tutorial Institute Dashboard" />
        <div className="d-flex justify-content-end p-3">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="home-content">
          <h2 className="home-title">Tutorial Institute Actions</h2>
          <p className="text-center mb-4">
            Welcome,{" "}
            {user?.profile?.instituteName || user?.auth?.email || "Institute"}!
          </p>

          <div className="verification-grid">
            <BigActionButton
              title="Verify Tutorial Certificate"
              subtitle="Verify tutorial certificates"
              icon="🔍"
              onClick={() => navigate("/verify-tutorial")}
            />

            <BigActionButton
              title="Enter New Tutorial Certificate"
              subtitle="Add a new tutorial certificate to the database"
              icon="📜"
              onClick={() => navigate("/enter-tutorial-certificate")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialDashboard;
