import React from "react";
import "./HeaderStyle.css";
import { FaRobot, FaUserMd, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/anti.png";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuthenticated }) => {
  const userName = localStorage.getItem('name');
  const navigate = useNavigate();

  const handlePageRobot = () => {
    navigate('/robot');
  };

  const handlePagePatient = () => {
    navigate('/patientlist');
  };

  const handleLogout = async () => {
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }
      localStorage.clear();
      setIsAuthenticated(false);
      navigate('/');
      
      
    } catch (error) {
      // 에러 처리 (예: 토스트 메시지 표시)
    }
  };



  return (
    <div className="header-container">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
        <span className="header-title">Anti-PS</span>
      </div>

      <div className="header-nav">
        <button onClick={handlePageRobot} className="header-nav-button">
          <FaRobot className="header-nav-icon" /> Robot Portal
        </button>
        <button onClick={handlePagePatient} className="header-nav-button">
          <FaUserMd className="header-nav-icon" /> Patient Portal
        </button>
      </div>

      <div className="header-right">
        <div className="header-user-info">
          <span className="header-user-name">{userName}</span>
        </div>
        <button onClick={handleLogout} className="header-logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
