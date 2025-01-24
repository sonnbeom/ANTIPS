import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import PatientList from './pages/PatientList.tsx';
import PatientDetail from './pages/PatientDetail.tsx';
import Header from './components/Header/Header.tsx';
import './App.css';
import MobileNavigation from './components/Mobilenavigation/MobileNavigation.tsx';
import PatientRegistration from './pages/PatientRegistration.tsx'

const App: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navHeight, setNavHeight] = useState(0);

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
        // 모바일 네비게이션 높이 측정
        const navElement = document.querySelector('.bottom-navigation');
        if (navElement) {
          setNavHeight(navElement.clientHeight);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      {!isMobile && <Header />}

      <div 
        className="content-container" 
        style={{ 
          paddingTop: headerHeight,
          paddingBottom: isMobile ? navHeight : 0 // 모바일일 때 하단 패딩 추가
        }}
      >
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/patientlist" element={<PatientList />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
          <Route path="/patientrgistration" element={<PatientRegistration />} />
        </Routes>
      </div>
      {isMobile && <MobileNavigation />}
    </Router>
  );
};


export default App;
