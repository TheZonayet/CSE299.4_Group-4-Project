import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
  to?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, label = "Back" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className="back-button" aria-label={label}>
      <span className="back-icon">←</span>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
