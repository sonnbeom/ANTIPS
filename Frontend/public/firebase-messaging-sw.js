importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// TypeScript로 타입을 정의
/** @typedef {import('firebase/messaging').FirebaseMessagingTypes.MessagePayload} MessagePayload */

try {
  firebase.initializeApp({
    apiKey: "AIzaSyDU59nrYHwiBdN0F46TwDKIVnhwS3NgDAM",
    authDomain: "pjt-01-caabb.firebaseapp.com",
    projectId: "pjt-01-caabb",
    storageBucket: "pjt-01-caabb.firebasestorage.app",
    messagingSenderId: "1053667815302",
    appId: "1:1053667815302:web:bfc991d4f228c9096f0607"
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    // payload의 타입을 확실히 하기 위해 조건을 추가
    if (!payload || !payload.notification) {
      console.error('Invalid notification payload');
      return;
    }

    // 모든 클라이언트에게 메시지 전달
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'FCM_MESSAGE',
          payload: {
            notification: payload.notification,
            data: payload.data || {},
            fcmMessageId: payload.messageId || Date.now().toString(),
            timestamp: Date.now()
          }
        });
      });
    });

    const notificationTitle = payload.notification.title || '새 알림';
    const notificationOptions = {
      body: payload.notification.body || '',
      icon: '/logo.png',
      badge: '/badge.png',
      timestamp: Date.now(),
      data: payload.data || {},
      requireInteraction: true
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // 알림 클릭 이벤트 처리
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // 알림 클릭시 클라이언트에게 이벤트 전달
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_CLICKED',
          notificationId: event.notification.data.notificationId
        });
      });
    });
  });

} catch (error) {
  console.error('Service Worker initialization failed:', error);
}
