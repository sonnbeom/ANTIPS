// components/BottomNavigation/BottomNavigation.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MobileNavigationStyle.css';
import { FaUser, FaRobot, FaHome } from 'react-icons/fa';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-navigation">
      <button 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <FaHome />
        <span>환자</span>
      </button>
      <button 
        className={`nav-item ${isActive('/robot') ? 'active' : ''}`}
        onClick={() => navigate('/robot')}
      >
        <FaRobot />
        <span>로봇</span>
      </button>
      <button 
        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <FaUser />
        <span>프로필</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;
