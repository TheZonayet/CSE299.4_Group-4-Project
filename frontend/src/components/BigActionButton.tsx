import React from "react";
import "./BigActionButton.css";

interface BigActionButtonProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const BigActionButton: React.FC<BigActionButtonProps> = ({
  title,
  subtitle,
  icon,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={`big-action-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div className="big-action-icon">{icon}</div>}
      <div className="big-action-content">
        <h3 className="big-action-title">{title}</h3>
        {subtitle && <p className="big-action-subtitle">{subtitle}</p>}
      </div>
    </button>
  );
};

export default BigActionButton;
