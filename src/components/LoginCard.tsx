import React from "react";
import "./LoginCard.css";
import logo from "../assets/asure-logo.png";




interface LoginOption {
  title: string;
  subtitle: string;
  icon: string;
}

interface LoginCardProps {
  options: LoginOption[];
  onSelect: (title: string) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ options, onSelect }) => {
  return (
    <div className="login-container fade-in">
      <img src={logo} alt="Asure Logo" className="logo" />

      <br></br>
      

      <button className="login-button">Login As</button>

      <div className="login-options">
        {options.map((opt) => (
          <div
            key={opt.title}
            className="login-option"
            onClick={() => onSelect(opt.title)}
          >
           
           <img src={opt.icon} alt={opt.title} className="icon" />
            <p className="option-title">{opt.title}</p>
            <span className="option-subtitle">{opt.subtitle}</span>
          </div>
        ))}
      </div>

      <p className="register-text">
        Don’t have an account? <a href="#">Register here!</a>
      </p>

      <p className="error-text">
        Validation errors / Exceptions will be displayed here
      </p>
    </div>
  );
};

export default LoginCard;
