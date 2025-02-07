import React from "react";
import "./FloorStyle.css"; // CSS 파일
import { FaBuilding } from "react-icons/fa";

// components/Patient/Floorbtn.tsx
interface FloorButtonProps {
  floor: string;
  isActive: boolean;
  onClick: () => void;
}

const FloorButton: React.FC<FloorButtonProps> = ({
  floor,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`patient-floor-button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="patient-floor-icon">
        <FaBuilding />
      </span>
      <span className="patient-floor-text">{floor}</span>
    </button>
  );
};

export default FloorButton;

