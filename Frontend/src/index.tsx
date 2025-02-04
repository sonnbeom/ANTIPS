import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 푸시 알림 권한 요청 함수
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.error('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('알림 권한이 거부되었습니다.');
    return false;
  }

  return true;
};

// 서비스 워커 등록 및 푸시 구독
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker가 지원되지 않습니다.');
    return;
  }

  serviceWorkerRegistration.register({
    onSuccess: async (registration) => {
      console.log('✅ Service Worker 등록 성공:', registration);

      // 푸시 알림 권한 요청
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY!)
        });

        console.log('📌 Push 알림 구독 완료:', JSON.stringify(subscription));
      } catch (error) {
        console.error('🚨 Push 구독 실패:', error);
      }
    },
    onUpdate: (registration) => {
      const waitingServiceWorker = registration.waiting;

      if (waitingServiceWorker) {
        if (window.confirm('새로운 버전이 있습니다. 업데이트하시겠습니까?')) {
          waitingServiceWorker.addEventListener('statechange', (event) => {
            if ((event.target as ServiceWorker).state === 'activated') {
              window.location.reload();
            }
          });

          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    }
  });
};

// VAPID 키를 변환하는 함수
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
// 서비스 워커 등록 실행
registerServiceWorker();
