import React, { useState } from "react";
import LoginPage from "./features/auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./layouts/Navbar";
import "./styles/App.css";

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);

  const handleLogin = (u: any) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <Navbar />
      {user ? (
        <Dashboard onLogout={handleLogout} user={user} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
