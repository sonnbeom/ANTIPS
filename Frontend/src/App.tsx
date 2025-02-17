import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const getItemWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  
  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const win = window as Window & typeof globalThis;

const App: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navHeight, setNavHeight] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') !== null
  );

  // 로그인 상태 체크 useEffect 추가
  useEffect(() => {
    const checkLoginStatus = () => {
        try {
            const loginStatus = getItemWithExpiry('loginStatus');
            const token = localStorage.getItem('token');
            
            // loginStatus가 만료되었거나 없는 경우 로그아웃 처리
            if (!loginStatus && token) {
                localStorage.clear();
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Login status check failed:', error);
            localStorage.clear();
            setIsAuthenticated(false);
        }
    };

    // 페이지 로드 시 즉시 체크
    checkLoginStatus();

    // 5분마다 체크 (300000 밀리초 = 5분)
    const intervalId = setInterval(checkLoginStatus, 300000);

    // beforeunload 이벤트 리스너 추가
    const handleBeforeUnload = () => {
        checkLoginStatus();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, []);

  const updateAuthStatus = () => {
    setIsAuthenticated(localStorage.getItem('token') !== null);
  };

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
