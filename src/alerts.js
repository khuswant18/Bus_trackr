import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function askForAlerts() {
  if (Platform.OS === 'web') {
    if ('Notification' in window) await Notification.requestPermission();
    return;
  }

  await Notifications.requestPermissionsAsync();
}

export async function sendAlert(title, body) {
  if (Platform.OS === 'web') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    return;
  }

  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}
