import React, { useState, useEffect } from 'react';
import './LoginStyle.css';
import hospital from '../assets/hospital.jpg';
import { useNavigate } from "react-router-dom";
import PushNotificationButton from "../components/Push/PushNotificationButton"

interface LoginProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}
const setItemWithExpiry = (key: string, value: string, ttl: number) => {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};



const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [employeeNumber, setEmployeeNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showNotificationButton, setShowNotificationButton] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // 로그인 상태에서 이미 토큰이 존재하는 경우 /robot 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/robot');
    }
  }, [navigate]);

  const checkNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = Notification.permission;
  
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
  
        if (permission === 'granted' && subscription) {
          navigate('/robot');
          return;
        }
        
        if (permission !== 'granted' || !subscription) {

          setShowNotificationButton(true);
        }
      } catch (error) {
        setShowNotificationButton(true);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {
      const loginData = {
        employeeNumber: employeeNumber,
        name: name,
        password: password
      };
  
      const response = await fetch('https://www.antips.site/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Login failed');
      }
  
      const data = await response.json();
      
      if (data.status === 200) {
        // 24시간 만료 시간 설정 (밀리초 단위)
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('name', name);
        setItemWithExpiry('loginstatus','true',TWENTY_FOUR_HOURS)
        setIsAuthenticated(true);
  
        const permission = Notification.permission;
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (permission === 'granted') {
          navigate('/robot');
        } else {
          setLoginSuccess(true);
          setShowNotificationButton(true);
        }
      }
    } catch (error) {
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-section">
          <div className='login-section-title'>
            <h2>Anti-PS</h2>
            {!loginSuccess ? (
              <p>Welcome back! Please login to your account.</p>
            ) : (
              <p>알림 설정을 완료해 주세요.</p>
            )}
          </div>
          
          {!loginSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="login-input-group">
                <input
                  type="text"
                  id="employeeNumber"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  placeholder="사원번호를 입력하세요"
                  required
                  className="login-input-username"
                  autoComplete="username"
                />
              </div>
              <div className="login-input-group">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                  className="login-input-username"
                  autoComplete="name"
                />
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="login-input-password"
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="login-button" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Log In"}
              </button>
            </form>
          ) : (
            <div className="push-notification-section">
              <h3>알림을 활성화해 주세요</h3>
              <p>원활한 서비스 이용을 위해 알림 권한이 필요합니다.</p>
              <PushNotificationButton />
            </div>
          )}
        </div>

        <div className="login-image-section">
          <img
            src={hospital} 
            alt="User Icon"
            className="login-user-icon"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
