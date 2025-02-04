import React from "react";
import "./FloorStyle.css"; // CSS 파일
import { FaBuilding } from "react-icons/fa";

interface FloorButtonProps {
  floor: string; // 층 정보 (예: "1층")
  isActive: boolean; // 활성화 여부
  onClick: () => void; // 클릭 이벤트 핸들러
}

const FloorButton: React.FC<FloorButtonProps> = ({
  floor,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`patient-floor-button ${isActive ? "active" : ""}`} // active 클래스 추가
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
