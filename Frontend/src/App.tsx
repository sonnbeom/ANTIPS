import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Navigate import
import Login from './pages/Login';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import Header from './components/Header/Header';
import './App.css';
import MobileNavigation from './components/Mobilenavigation/MobileNavigation';
import PatientRegistration from './pages/PatientRegistration';
import PatientEdit from './pages/PatientEdit';
import Robot from './pages/Robot';

declare global {
  interface Window {
    workbox: any;
  }
}

// window 객체 타입 지정
const win = window as Window & typeof globalThis;

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
          {/* 로그인 여부에 따라 페이지 접근 제한 */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/patientlist" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/robot" element={isAuthenticated ? <Robot /> : <Navigate to="/" />} />
          <Route path="/patientlist" element={isAuthenticated ? <PatientList /> : <Navigate to="/" />} />
          <Route path="/patient/:id" element={isAuthenticated ? <PatientDetail /> : <Navigate to="/" />} />
          <Route path="/patientregistration" element={isAuthenticated ? <PatientRegistration /> : <Navigate to="/" />} />
          <Route path="/patient/edit/:id" element={isAuthenticated ? <PatientEdit /> : <Navigate to="/" />} />
        </Routes>
      </div>

      {isAuthenticated && isMobile && <MobileNavigation setIsAuthenticated={setIsAuthenticated} />}
    </Router>
  );
};

export default App;
