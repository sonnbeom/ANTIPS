import React, { useState, useEffect } from "react";
import { onMessage, getMessaging, getToken } from 'firebase/messaging';
import { messaging } from '../../firebase';

interface FCMNotification {
  from: string; // 알림의 발신자
  collapseKey: string; // 알림 그룹화 키
  messageId: string;
  notification: {
    title: string;
    body: string;
  };
  data: {
    [key: string]: string;
  };
  timestamp: number;
}

const PushNotificationViewer: React.FC = () => {
  const [notifications, setNotifications] = useState<FCMNotification[]>([]);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        // 포그라운드 메시지 리스너
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);
          if (payload) {
            setNotifications(prev => [
              ...prev,
              {
                from: payload.from || '알 수 없음', // 기본값 추가
                collapseKey: payload.collapseKey || '기본 키', // 기본값 추가
                messageId: payload.messageId || Date.now().toString(),
                notification: {
                  title: payload.notification?.title || '기본 제목', // 기본 제목 추가
                  body: payload.notification?.body || '기본 내용', // 기본 내용 추가
                },
                data: payload.data || {},
                timestamp: Date.now()
              }
            ]);
          }
        });

        // 서비스 워커 메시지 리스너
        navigator.serviceWorker.addEventListener("message", (event) => {
          console.log("SW message received:", event.data);
          
          const message = event.data;
          if (message && message.payload?.notification?.title) {
            setNotifications(prev => [
              ...prev,
              {
                from: message.payload.from || '알 수 없음', // 기본값 추가
                collapseKey: message.payload.collapseKey || '기본 키', // 기본값 추가
                messageId: message.payload.fcmMessageId || Date.now().toString(),
                notification: {
                  title: message.payload.notification?.title || '기본 제목', // 기본 제목 추가
                  body: message.payload.notification?.body || '기본 내용', // 기본 내용 추가
                },
                data: message.payload.data || {},
                timestamp: Date.now()
              }
            ]);
          }
        });

        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      });
    }

    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        const messagingInstance = getMessaging();
        const token = await getToken(messagingInstance, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "500px", 
      border: "1px solid #ccc", 
      borderRadius: "8px",
      margin: "20px"
    }}>
      <h3>푸시 알림 확인</h3>
      <p>알림 권한 상태: {permission}</p>
      
      {permission !== "granted" && (
        <button 
          onClick={requestPermission}
          style={{
            padding: "8px 16px",
            marginBottom: "16px"
          }}
        >
          알림 권한 요청
        </button>
      )}
      
      <h4>수신된 알림</h4>
      <div style={{ maxHeight: "300px", overflow: "auto" }}>
        {notifications.length > 0 ? (
          notifications
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .map((notification) => (
              <div 
                key={notification.messageId}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px"
                }}
              >
                <strong>{notification.notification.title}</strong>
                <p style={{ margin: "4px 0" }}>{notification.notification.body}</p>
                <small style={{ color: "#666" }}>
                  {new Date(notification.timestamp || Date.now()).toLocaleString()}
                </small>
                <small style={{ color: "#888", display: "block" }}>
                  Message ID: {notification.messageId}
                </small>
              </div>
            ))
        ) : (
          <p>수신된 알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PushNotificationViewer;
