import React, { useState, useEffect } from 'react';
import './LoginStyle.css';
import hospital from '../assets/hospital.jpg';
import { useNavigate } from "react-router-dom";
import PushNotificationButton from "../components/Push/PushNotificationButton"

interface LoginProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [employeeNumber, setEmployeeNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showNotificationButton, setShowNotificationButton] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = Notification.permission;
      console.log('현재 알림 권한 상태:', permission);
  
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        console.log('서비스 워커 등록 상태:', registration);
        console.log('구독 상태:', subscription ? '구독됨' : '미구독');
  
        if (permission === 'granted' && subscription) {
          console.log('알림 권한 및 구독이 모두 활성화되어 있습니다.');
          navigate('/robot');
          return;
        }
        
        if (permission !== 'granted' || !subscription) {
          console.log('알림 설정이 필요합니다.');
          setShowNotificationButton(true);
        }
      } catch (error) {
        console.error("알림 구독 확인 실패:", error);
        setShowNotificationButton(true);
      }
    }
  };
  
  // handleSubmit 함수 수정
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {
      const loginData = {
        employeeNumber: employeeNumber,
        name: name,
        password: password
      };
  
      console.log('Sending login data:', loginData);
  
      const response = await fetch('https://43.203.254.199:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify(loginData)
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || 'Login failed');
      }
  
      const data = await response.json();
      console.log('Login success:', data);
      
      if (data.status === 200) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('name', name);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setIsAuthenticated(true);
        // 로그인 성공 후 즉시 알림 상태 확인
        const permission = Notification.permission;
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        console.log(permission)
        console.log(registration)
        console.log(subscription)
        if (permission === 'granted') {
          navigate('/robot');
        } else {
          setLoginSuccess(true);
          setShowNotificationButton(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-section">
          <div className='login-section-title'>
            <h2>NurseCertify</h2>
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
