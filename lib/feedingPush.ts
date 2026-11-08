import { Platform } from 'react-native';
import { supabase } from './supabase';

// Only import this file on native devices. expo-notifications is not supported on web.
// Requires `npx expo install expo-notifications` before an Android build.
const PROJECT_ID = 'cdc90232-0d2e-473d-bf48-3be8c9daa142';

export async function registerFeedingPush(): Promise<void> {
  if (Platform.OS === 'web') return;
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) return;
  const Notifications = await import('expo-notifications');
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('carefur-feeding', {
      name: 'CareFur Feeding Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 100, 250],
    });
  }
  const existing = await Notifications.getPermissionsAsync();
  const permission = existing.granted ? existing : await Notifications.requestPermissionsAsync();
  if (!permission.granted) return;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;
  const { error } = await supabase.functions.invoke('register-feeding-push', {
    body: { token, platform: Platform.OS, action: 'register' },
  });
  if (error) throw error;
}

export async function unregisterFeedingPush(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;
    await supabase.functions.invoke('register-feeding-push', {
      body: { token, action: 'unregister' },
    });
  } catch (error) {
    console.warn('Unable to unregister feeding notifications:', error);
  }
}

export async function configureFeedingNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  const Notifications = await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
