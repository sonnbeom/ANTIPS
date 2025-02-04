import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import Header from './components/Header/Header';
import './App.css';
import MobileNavigation from './components/Mobilenavigation/MobileNavigation';
import PatientRegistration from './pages/PatientRegistration';
import PatientEdit from './pages/PatientEdit';
import Robot from './pages/Robot';

const App: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navHeight, setNavHeight] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') !== null
  );

  const updateAuthStatus = () => {
    setIsAuthenticated(localStorage.getItem('token') !== null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      updateAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setTimeout(() => {
        if (!isMobile) {
          const headerElement = document.querySelector('.header-container');
          setHeaderHeight(headerElement ? headerElement.clientHeight : 0);
        } else {
          setHeaderHeight(0);
          const navElement = document.querySelector('.bottom-navigation');
          setNavHeight(navElement ? navElement.clientHeight : 0);
        }
      }, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && !isMobile && <Header setIsAuthenticated={setIsAuthenticated} />}

      <div 
        className="content-container" 
        style={{ 
          paddingTop: headerHeight,
          paddingBottom: isMobile ? navHeight : 0,
        }}
      >
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/robot" element={<Robot />} />
          <Route path="/patientlist" element={<PatientList />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
          <Route path="/patientregistration" element={<PatientRegistration />} />
          <Route path="/patient/edit/:patientId" element={<PatientEdit />} />
        </Routes>
      </div>
      {isAuthenticated && isMobile && <MobileNavigation setIsAuthenticated={setIsAuthenticated} />}
    </Router>
  );
};

export default App;
