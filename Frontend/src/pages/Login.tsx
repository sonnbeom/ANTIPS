// import React, { useState } from 'react';
// import './LoginStyle.css'; // 스타일 파일
// import hospital from '../assets/hospital.jpg';
// import { useNavigate } from "react-router-dom";
// import PushNotificationButton from "../components/Push/PushNotificationButton"
// interface LoginProps {
//   setIsAuthenticated: (isAuth: boolean) => void;
// }

// const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
//   const [name, setName] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const navigate = useNavigate();


//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log('Username:', name);
//     console.log('Password:', password);
    
//     // 로그인 처리
//     localStorage.setItem('token', 'a1');
//     setIsAuthenticated(true); // 로그인 상태 즉시 반영
//     navigate('/robot');
//   };

//   // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   //   event.preventDefault();
    
//   //   try {
//   //     const response = await fetch('/api/v1/auth', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         name: name,
//   //         password: password,
//   //       }),
//   //       credentials: 'include', // 쿠키를 주고받기 위해 필요
//   //     });
  
//   //     if (!response.ok) {
//   //       throw new Error('Login failed');
//   //     }
  
//   //     const data = await response.json();
      
//   //     if (data.status === 200) {
//   //       // accessToken을 localStorage에 저장
//   //       localStorage.setItem('token', data.data.accessToken);
        
//   //       // refreshToken은 서버에서 HttpOnly 쿠키로 설정되어야 함
//   //       // 프론트엔드에서는 별도 처리 불필요
        
//   //       setIsAuthenticated(true);
//   //       navigate('/robot');
//   //     }
//   //   } catch (error) {
//   //     console.error('Login error:', error);
//   //   }
//   // };
  
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         {/* 로그인 폼 섹션 */}
//         <div className="login-form-section">
//           <div className='login-section-title'>
//             <h2>NurseCertify</h2>
//             <p>Welcome back! Please login to your account.</p>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="login-input-group">
//               <input
//                 type="text"
//                 id="username"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Enter username"
//                 required
//                 className="login-input-username"
//               />
//             </div>
//             <div className="login-input-group">
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 required
//                 className="login-input-password"
//               />
//             </div>
//             <button type="submit" className="login-button">Log In</button>

//           </form>
//            <PushNotificationButton />
//         </div>

//         {/* 이미지 섹션 */}
//         <div className="login-image-section">
//           <img
//             src={hospital} 
//             alt="User Icon"
//             className="login-user-icon"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginStyle.css';
import hospital from '../assets/hospital.jpg';
import PushNotificationButton from "../components/Push/PushNotificationButton"

interface LoginProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // 알림 권한 상태 확인
  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.permission;
      if (permission === 'granted') {
        // 서비스 워커 구독 상태 확인
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return !!subscription; // 구독이 있으면 true, 없으면 false
      }
    }
    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      // 로그인 처리
      localStorage.setItem('token', 'a1');
      setIsAuthenticated(true);
      
      // 알림 권한 및 구독 상태 확인
      const hasNotificationEnabled = await checkNotificationPermission();
      
      if (hasNotificationEnabled) {
        // 이미 알림이 활성화되어 있으면 바로 리다이렉트
        navigate('/robot');
      } else {
        // 알림이 활성화되어 있지 않으면 알림 설정 UI 표시
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {!showNotification ? (
          <div className="login-form-section">
            <div className='login-section-title'>
              <h1>Anti-protective suit</h1>
              <p>Welcome back! Please login to your account.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="login-input-group">
                <label htmlFor="username" className="visually-hidden">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="login-input-username"
                  autoComplete="username"
                  aria-required={true}
                  disabled={isLoading}
                />
              </div>
              <div className="login-input-group">
                <label htmlFor="password" className="visually-hidden">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="login-input-password"
                  autoComplete="current-password"
                  aria-required={true}
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit"
                className="login-button"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        ) : (
          <div className="notification-section" role="alert">
            <h2>알림 설정</h2>
            <p>서비스 이용을 위해 알림을 활성화해 주세요.</p>
            <PushNotificationButton />
          </div>
        )}

        <div className="login-image-section">
          <img
            src={hospital} 
            alt="Hospital building"
            className="login-user-icon"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

