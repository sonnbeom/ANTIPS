function urlBase64ToUint8Array(base64String: string) {
  try {
    // 공개키만 추출 (privateKey 부분 제거)
    const publicKey = base64String.split(',')[0].split('"')[0];
    console.log('Public key only:', publicKey);

    const padding = '='.repeat((4 - publicKey.length % 4) % 4);
    const base64 = (publicKey + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    console.log('Processed base64:', base64);

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error('Base64 decoding error:', error);
    throw error;
  }
}

export const pushNotificationService = {
  async requestPermission() {
    const permission = await Notification.requestPermission();
    return permission;
  },

  async subscribeToPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;

      if (!process.env.REACT_APP_VAPID_PUBLIC_KEY) {
        throw new Error('VAPID public key is not defined');
      }

      const applicationServerKey = urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
      
      await this.sendSubscriptionToServer(subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      throw error;
    }
  },

  async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }
};
