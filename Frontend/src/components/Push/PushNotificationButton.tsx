import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pushNotificationService } from '../../services/pushNotification';
import './PushNotificationButtonStyle.css';

const PushNotificationButton: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnablePushNotification = async () => {
    try {
      setIsLoading(true);
      const permission = await pushNotificationService.requestPermission();
      
      if (permission === 'granted') {
        navigate('/robot');
      } else {
        alert('알림을 허용해주세요.');
      }
    } catch (error) {
      alert('알림 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className="push-notification-button"
      onClick={handleEnablePushNotification}
      disabled={isLoading}
    >
      {isLoading ? '설정 중...' : '알림 활성화'}
    </button>
  );
};


export default PushNotificationButton;
