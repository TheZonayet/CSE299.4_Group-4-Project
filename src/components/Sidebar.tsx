import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, getVerificationLimits } from "../services/api";
import logo from "../assets/Website logo.png";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    getVerificationLimits()
      .then((data) => setCredits(data.credits))
      .catch(() => setCredits(0));
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Asure Logo" className="sidebar-logo" />
        {onToggle && (
          <button className="sidebar-toggle" onClick={onToggle}>
            {isOpen ? "«" : "»"}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="sidebar-content">
          <div className="sidebar-credits">
            <h6>Verification Credits</h6>
            <div className="credits-badge">{credits}</div>
          </div>

          <nav className="sidebar-nav">
            <Link to="/home" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>
              Home
            </Link>
            <Link to="/history" className="sidebar-link">
              <span className="sidebar-icon">📜</span>
              Verification History
            </Link>
            <Link to="/profile" className="sidebar-link">
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
  );
};

export default Sidebar;
