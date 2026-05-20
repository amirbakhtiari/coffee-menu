
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('این مرورگر از نوتیفیکیشن پشتیبانی نمی‌کند');
    return false;
  }

  // اگر قبلاً اجازه گرفته شده
  if (Notification.permission === 'granted') return true;

  // درخواست اجازه جدید
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('خطا در درخواست اجازه نوتیفیکیشن:', error);
    return false;
  }
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    if (Notification.permission === 'granted') {
      registration.showNotification(title, {
        body: options?.body || 'پیام جدید از کافه لند',
        icon: 'https://img.icons8.com/color/192/coffee-beans.png',
        badge: 'https://img.icons8.com/color/96/coffee-beans.png',
        vibrate: [200, 100, 200],
        tag: options?.tag || 'default-tag',
        renotify: true,
        data: {
          url: window.location.origin
        },
        ...options
      } as any);
    } else {
      console.warn('اجازه نوتیفیکیشن صادر نشده است');
    }
  });
};

export const scheduleTestNotification = (delayMs: number = 5000) => {
  console.log(`نوتیفیکیشن برای ${delayMs} میلی‌ثانیه دیگر برنامه‌ریزی شد...`);
  setTimeout(() => {
    showNotification('☕ قهوه شما آماده است!', {
      body: 'باریستای کافه لند سفارش شما را آماده کرده است. نوش جان!',
      tag: 'order-ready',
    });
  }, delayMs);
};
