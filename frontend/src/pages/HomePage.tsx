import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BigActionButton from "../components/BigActionButton";
import BackButton from "../components/BackButton";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to role-specific dashboard if user is an institute or company
    getProfile()
      .then((data) => {
        setUser(data.user);
        const role = data.user?.role?.toUpperCase();

        // Redirect based on role (backend uses EDUCATION, MEDICINE, TUTORIALS)
        if (role === "EDUCATION") {
          navigate("/education-dashboard", { replace: true });
        } else if (role === "MEDICINE") {
          navigate("/medicine-dashboard", { replace: true });
        } else if (role === "TUTORIALS") {
          navigate("/tutorial-dashboard", { replace: true });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

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
        <StatusBar title="Verification Dashboard" />

        <div className="home-content">
          <h2 className="home-title">Select Verification Type</h2>

          <div className="verification-grid">
            <BigActionButton
              title="Verify Educational Institute"
              subtitle="Validate certificates from educational institutions"
              icon="🎓"
              onClick={() => navigate("/verify-education")}
            />

            <BigActionButton
              title="Verify Medicines"
              subtitle="Check authenticity of pharmaceutical products"
              icon="💊"
              onClick={() => navigate("/verify-medicine")}
            />

            <BigActionButton
              title="Verify Random Products"
              subtitle="Authenticate any product via QR code"
              icon="📦"
              onClick={() => navigate("/verify-product")}
            />

            <BigActionButton
              title="Verify Tutorial Certificate"
              subtitle="Validate tutorial institute certificates"
              icon="📜"
              onClick={() => navigate("/verify-tutorial")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
