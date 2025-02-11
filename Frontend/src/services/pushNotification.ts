import { messaging } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';

const API_URL = import.meta.env.VITE_SERVER_URL;
export const pushNotificationService = {
  
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await this.getFCMToken();
        // FCM 메시지 리스너 등록
        this.setupMessageListener();
        return permission;
      }
      return permission;
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      throw new Error('알림 권한 요청에 실패했습니다.');
    }
  },

  async getFCMToken() {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // 토큰을 서버로 전송
        await this.sendTokenToServer(currentToken);
        return currentToken;
      }
      
      throw new Error('FCM 토큰을 받을 수 없습니다.');
    } catch (error) {
      console.error('FCM 토큰 발급 실패:', error);
      throw error;
    }
  },

  // 토큰을 서버로 전송하는 새로운 메서드
  async sendTokenToServer(token: string) {
    try {
      const serverToken = localStorage.getItem('token');
      if (!serverToken) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetch(`${API_URL}/non-public/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`
        },
        body: JSON.stringify({ token: token })
      });

      if (!response.ok) {
        throw new Error('FCM 토큰 서버 전송 실패');
      }
      console.log('FCM 토큰이 서버에 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('FCM 토큰 서버 전송 중 오류:', error);
      throw error;
    }
  },

  // FCM 메시지 리스너 설정
  setupMessageListener() {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // 브라우저 알림 생성
      if (payload.notification) {
        const { title, body } = payload.notification;
        new Notification(title || '', {
          body,
          icon: '/icons/icon-192x192.png'
        });
      }

      // Service Worker에 메시지 전달
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FCM_MESSAGE',
          payload
        });
      }
    });
  }
};
