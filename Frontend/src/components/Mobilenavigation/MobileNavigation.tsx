import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MobileNavigationStyle.css';
import { FaRobot, FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';

interface MobileNavigationProps {
  nurseName?: string;
  setIsAuthenticated: (isAuth: boolean) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  nurseName = localStorage.getItem('name'), 
  setIsAuthenticated
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
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
    <nav className="bottom-navigation">
      <button 
        className={`nav-item ${isActive('/robot') ? 'active' : ''}`}
        onClick={() => navigate('/robot')}
      >
        <FaRobot />
        <span>로봇</span>
      </button>
      <button 
        className={`nav-item ${isActive('/patientlist') ? 'active' : ''}`}
        onClick={() => navigate('/patientlist')}
      >
        <FaHome />
        <span>환자</span>
      </button>
      <button 
        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
      >
        <FaUser />
        <span>{nurseName}</span>
      </button>
      <button 
        className="nav-item"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>로그아웃</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;
