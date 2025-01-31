// components/BottomNavigation/BottomNavigation.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MobileNavigationStyle.css';
import { FaRobot, FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';

interface MobileNavigationProps {
  nurseName?: string;
  onLogout?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  nurseName = "김간호", 
  onLogout = () => {} 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
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
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
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
        onClick={onLogout}
      >
        <FaSignOutAlt />
        <span>로그아웃</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;
