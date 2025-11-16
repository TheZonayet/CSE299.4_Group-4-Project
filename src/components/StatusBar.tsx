import React from "react";
import "./StatusBar.css";

interface StatusBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  title = "Asure",
  showBackButton,
  onBackClick,
}) => {
  return (
    <div className="status-bar">
      {showBackButton && (
        <button className="status-bar-back" onClick={onBackClick}>
          ←
        </button>
      )}
      <h1 className="status-bar-title">{title}</h1>
    </div>
  );
};

export default StatusBar;
