export const sendDesktopNotification = async (title: string, body: string) => {
  try {
    if (typeof window === 'undefined') return;

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/icons/128x128.png',
          silent: false,
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icons/128x128.png',
            silent: false,
          });
        }
      }
    }
  } catch (e) {
    console.warn('Notification not supported or denied:', e);
  }
};
