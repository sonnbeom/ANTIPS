import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { pushNotificationService } from '../../services/pushNotification';
import './PushNotificationButtonStyle.css';

const PushNotificationButton: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const permission = await Notification.permission;
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
        
        if (subscription) {
          navigate('/robot');
        }
      }
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
    }
  }, [navigate]);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const handleEnablePushNotification = async () => {
    try {
      setIsLoading(true);
      const permission = await pushNotificationService.requestPermission();
      
      if (permission === 'granted') {
        await pushNotificationService.subscribeToPushNotifications();
        setIsSubscribed(true);
        navigate('/robot');
      }
    } catch (error) {
      console.error('Push notification setup failed:', error);
      alert('알림 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return null;
  }

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
