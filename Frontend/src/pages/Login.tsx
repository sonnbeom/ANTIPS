import React, { useState } from 'react';
import './LoginStyle.css'; // 스타일 파일
import hospital from '../assets/hospital.jpg'
import { useNavigate } from "react-router-dom";
const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    localStorage.setItem('token', 'a1');
    navigate('/robot')
  };
  return (
    <div className="login-container">
      <div className="login-box">
        {/* 로그인 폼 섹션 */}
        <div className="login-form-section">
            <div className='login-section-title'>
                <h2>NurseCertify</h2>
                <p>Welcome back! Please login to your account.</p>
            </div>
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
