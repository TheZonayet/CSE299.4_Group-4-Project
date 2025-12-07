import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/Website logo.png";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const monthlyFreeCredits = 100;
  const creditsRemaining = monthlyFreeCredits - (user?.monthlyCreditsUsed || 0);

  console.log("Sidebar - user.monthlyCreditsUsed:", user?.monthlyCreditsUsed);
  console.log("Sidebar - creditsRemaining:", creditsRemaining);

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
              <div className="credits-badge">{creditsRemaining}</div>
            </div>

            <nav className="sidebar-nav">
              <Link to="/home" className="sidebar-link" onClick={closeSidebar}>
                <span className="sidebar-icon">🏠</span>
                Home
              </Link>
              <Link
                to="/history"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                <span className="sidebar-icon">📜</span>
                Verification History
              </Link>
              <Link
                to="/profile"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                <span className="sidebar-icon">👤</span>
                Profile
              </Link>
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
