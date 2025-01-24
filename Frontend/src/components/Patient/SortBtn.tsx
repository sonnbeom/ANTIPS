import React from "react";
import "./SortBtnStyle.css"; // CSS 파일

interface SortButtonProps {
  label: string; // 버튼에 표시될 텍스트
  isActive: boolean; // 현재 활성화 여부
  onClick: () => void; // 클릭 이벤트 핸들러
}

const SortButton: React.FC<SortButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`sort-button ${isActive ? "active" : ""}`} // 활성화 상태에 따라 클래스 추가
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SortButton;
