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


import React, { useState } from 'react';
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 로그인 처리
    localStorage.setItem('token', 'a1');
    setIsAuthenticated(true);
    setShowNotification(true); // 로그인 성공 후 알림 동의 UI 표시
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {!showNotification ? (
          // 로그인 폼
          <div className="login-form-section">
            <div className='login-section-title'>
              <h2>Anti-protective suit</h2>
              <p>Welcome back! Please login to your account.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="login-input-group">
                <input
                  type="text"
                  id="username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="login-input-username"
                />
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="login-input-password"
                />
              </div>
              <button type="submit" className="login-button">Log In</button>
            </form>
          </div>
        ) : (
          // 알림 동의 UI
          <div className="notification-section">
            <h2>알림 설정</h2>
            <p>서비스 이용을 위해 알림을 활성화해 주세요.</p>
            <PushNotificationButton />
          </div>
        )}

        {/* 이미지 섹션 */}
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
