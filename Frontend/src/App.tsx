import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import PatientList from './pages/PatientList.tsx';
import PatientDetail from './pages/PatientDetail.tsx';
import Header from './components/Header/Header.tsx';
import './App.css';
import MobileNavigation from './components/Mobilenavigation/MobileNavigation.tsx';
import PatientRegistration from './pages/PatientRegistration.tsx'
import Robot from './pages/Robot.tsx';

const App: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navHeight, setNavHeight] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        const headerElement = document.querySelector('.header-container');
        if (headerElement) {
          setHeaderHeight(headerElement.clientHeight);
        }
      } else {
        setHeaderHeight(0);
        const navElement = document.querySelector('.bottom-navigation');
        if (navElement) {
          setNavHeight(navElement.clientHeight);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      {isAuthenticated && !isMobile && <Header onLogout={handleLogout} />}

      <div 
        className="content-container" 
        style={{ 
          paddingTop: headerHeight,
          paddingBottom: isMobile ? navHeight : 0
        }}
      >
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/robot" element={<Robot />} />
          <Route path="/patientlist" element={<PatientList />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
          <Route path="/patientrgistration" element={<PatientRegistration />} />
        </Routes>
      </div>

      {isAuthenticated && isMobile && <MobileNavigation />}
    </Router>
  );
};

export default App;
