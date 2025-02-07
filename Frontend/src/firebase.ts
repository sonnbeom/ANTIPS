import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDU59nrYHwiBdN0F46TwDKIVnhwS3NgDAM",
    authDomain: "pjt-01-caabb.firebaseapp.com",
    projectId: "pjt-01-caabb",
    storageBucket: "pjt-01-caabb.firebasestorage.app",
    messagingSenderId: "1053667815302",
    appId: "1:1053667815302:web:bfc991d4f228c9096f0607"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// FCM 토큰 가져오기
export const getFCMToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: 'BKh0wkKMFkZD2DRwKDgYsQkp9zv9jYOqIbA_O6-PiHX7wao5jr38OmnExn5sAf1o4y6m5jGVllYjRL1zLJMdb9s'
        });
        
        if (currentToken) {
            console.log('FCM 토큰:', currentToken);
            return currentToken;
        } else {
            console.log('토큰을 가져올 수 없습니다. 알림 권한을 확인하세요.');
            return null;
        }
    } catch (error) {
        console.error('FCM 토큰 발급 실패:', error);
        throw error;
    }
};

// 알림 권한 요청
export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getFCMToken();
            console.log('FCM Token:', token);
        } else {
            console.log('알림 권한이 거부되었습니다.');
        }
    } catch (error) {
        console.error('알림 권한 요청 실패:', error);
    }
};

// 포그라운드 메시지 리스너 설정
onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // 메시지 알림 표시
    if (payload.notification) {
        const { title, body } = payload.notification;
        new Notification(title || '새로운 알림', {
            body,
            icon: '/icons/icon-192x192.png'
        });
    }
});

export { messaging };
