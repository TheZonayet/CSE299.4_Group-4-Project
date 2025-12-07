import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, getVerificationLimits } from "../services/api";
import logo from "../assets/Website logo.png";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getVerificationLimits()
      .then((data) => setCredits(data.credits))
      .catch(() => setCredits(0));
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only visible when sidebar is closed */}
      {!isOpen && (
        <button className="hamburger-menu" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Overlay - Click to close */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Asure Logo" className="sidebar-logo" />
          <button className="sidebar-close" onClick={closeSidebar}>
            ✕
          </button>
        </div>

        {isOpen && (
          <div className="sidebar-content">
            <div className="sidebar-credits">
              <h6>Verification Credits</h6>
              <div className="credits-badge">{credits}</div>
            </div>

            <nav className="sidebar-nav">
              <button
                className="sidebar-link as-button"
                onClick={() => {
                  navigate("/home");
                  closeSidebar();
                }}
              >
                <span className="sidebar-icon">🏠</span>
                Home
              </button>
              <button
                className="sidebar-link as-button"
                onClick={() => {
                  navigate("/history");
                  closeSidebar();
                }}
              >
                <span className="sidebar-icon">📜</span>
                Verification History
              </button>
              <button
                className="sidebar-link as-button"
                onClick={() => {
                  navigate("/profile");
                  closeSidebar();
                }}
              >
                <span className="sidebar-icon">👤</span>
                Profile
              </button>
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
              <span className="sidebar-icon">🚪</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
