import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface DashboardProps {
  onLogout: () => void; // 👈 receive logout handler
  user?: { username?: string; role?: string } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
        <h4 className="mb-4">Menu</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Dashboard
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Users
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link text-white" href="#">
              Settings
            </a>
          </li>
          <li className="nav-item">
            {/* 👇 call logout when clicked */}
            <button
              className="btn btn-outline-danger w-100 mt-3"
              onClick={onLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        <h2>Dashboard</h2>
        <p>Welcome{user?.username ? `, ${user.username}` : ""}!</p>
        <p>Role: {user?.role ?? "N/A"}</p>
      </div>
    </div>
  );
};

export default Dashboard;
