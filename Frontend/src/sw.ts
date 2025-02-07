// /// <reference lib="webworker" />

// declare const self: ServiceWorkerGlobalScope;

// import { precacheAndRoute } from 'workbox-precaching'
// import { clientsClaim } from 'workbox-core'

// self.__WB_DISABLE_DEV_LOGS = true;

// self.skipWaiting()
// clientsClaim()

// precacheAndRoute(self.__WB_MANIFEST)

// // 서비스 워커 설치 이벤트
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installed:', event)
// })

// // 서비스 워커 활성화 이벤트
// self.addEventListener('activate', (event) => {
//   console.log('Service Worker activated:', event)
// })

// // 푸시 구독 이벤트
// self.addEventListener('pushsubscriptionchange', (event) => {
//   console.log('Push Subscription changed:', event)
// })

// // 푸시 이벤트 리스너 추가
// self.addEventListener("push", (event) => {
//   if (!event.data) return;

//   try {
//     const data = event.data.json();
//     const title = data.title || "새로운 알림";
//     const options = {
//       body: data.body,
//       icon: data.icon || "/logo192.png",
//       badge: data.badge || "/badge.png",
//       data: { url: data.url }
//     };

//     event.waitUntil(
//       self.registration.showNotification(title, options)
//     );

//     // React 앱으로 데이터 전달
//     event.waitUntil(
//       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
//         clients.forEach((client) => {
//           client.postMessage({ title: data.title, body: data.body });
//         });
//       })
//     );

//   } catch (error) {
//     console.error("푸시 알림 처리 중 오류:", error);
//   }
// });




// // 알림 클릭 이벤트 처리
// // 알림 클릭 이벤트 처리
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();

//   event.waitUntil(
//     self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
//       for (const client of clientList) {
//         if ('focus' in client) {
//           return client.focus();
//         }
//       }
//       if (event.notification.data && event.notification.data.url) {
//         return self.clients.openWindow(event.notification.data.url);
//       }
//       return self.clients.openWindow('/');
//     }).catch(error => console.error('Error handling notification click:', error))
//   );
// });




// // 알림 닫기 이벤트
// self.addEventListener('notificationclose', (event) => {
//   console.log('Notification closed:', event)
// })


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDU59nrYHwiBdN0F46TwDKIVnhwS3NgDAM",
//   authDomain: "pjt-01-caabb.firebaseapp.com",
//   projectId: "pjt-01-caabb",
//   storageBucket: "pjt-01-caabb.firebasestorage.app",
//   messagingSenderId: "1053667815302",
//   appId: "1:1053667815302:web:bfc991d4f228c9096f0607"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// public/firebase-messaging-sw.js
// /// <reference lib="webworker" />
// declare const self: ServiceWorkerGlobalScope;

// importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });



