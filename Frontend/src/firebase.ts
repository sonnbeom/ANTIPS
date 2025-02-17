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
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });
        
        if (currentToken) {

            return currentToken;
        } else {

            return null;
        }
    } catch (error) {

        throw error;
    }
};

// 알림 권한 요청
export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getFCMToken();

        } else {

        }
    } catch (error) {

    }
};

// 포그라운드 메시지 리스너 설정
onMessage(messaging, (payload) => {

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
