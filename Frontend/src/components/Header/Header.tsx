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
        console.error('No token found');
        return;
      }

      // 로그아웃 API 호출
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // 로그아웃 성공 시 로컬 스토리지 클리어
      localStorage.clear();
      setIsAuthenticated(false);
      navigate('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // 에러 처리 (예: 토스트 메시지 표시)
    }
  };



  return (
    <div className="header-container">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
        <span className="header-title">Anti-protective suit</span>
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
