import React from "react";
import "../../Css/Util/HeaderStyle.css"; // CSS 파일
import { FaRobot, FaUserMd, FaSignOutAlt } from "react-icons/fa"; // 아이콘 사용
import logo from "../../Image/robot.png"
import user from "../../Image/user.png"


const Header: React.FC = () => {
  const userName = "Dr. Sarah Kim"; // 사용자 이름
  const userImage = user
  return (
    <div className="header-container">
      {/* 로고 및 서비스명 */}
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
        <span className="header-title">MediBot Control</span>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="header-nav">
        <button className="header-nav-button">
          <FaRobot className="header-nav-icon" /> Robot Portal
        </button>
        <button className="header-nav-button">
          <FaUserMd className="header-nav-icon" /> Patient Portal
        </button>
      </div>

      {/* 사용자 정보 및 로그아웃 */}
      <div className="header-right">
        <div className="header-user-info">
        <img src={userImage} alt="User" className="header-user-image" />
          <span className="header-user-name">{userName}</span>
        </div>
        <button className="header-logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
