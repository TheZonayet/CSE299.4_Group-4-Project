import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  onClick,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      className={`back-button btn btn-link ${className}`}
      onClick={handleClick}
    >
      ← Back
    </button>
  );
};

export default BackButton;
