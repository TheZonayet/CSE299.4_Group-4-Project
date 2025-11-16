import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, clearToken } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setLoading(false);
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
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white vh-100 p-3 dashboard-sidebar">
        <h4 className="mb-4">Menu</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Dashboard
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Profile
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Verification History
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Settings
            </a>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-outline-danger w-100 mt-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        <h2>Dashboard</h2>
        <p>
          Welcome, {user?.auth?.email || user?.profile?.officialEmail || "User"}
          !
        </p>
        <p>Role: {user?.role ?? "N/A"}</p>
        <p>Verification Credits: {user?.verificationCredits ?? 0}</p>
      </div>
    </div>
  );
};

export default Dashboard;
