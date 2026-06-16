import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { NotificationTime } from '@/types/database';

const REMINDER_IDENTIFIER = 'doneday-evening-reminder';

const REMINDER_MESSAGES = [
  'What did you get done today? ✓',
  'Three things. That’s all. Log your dones.',
  "Your day's not over until you write it down.",
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function timeToParts(time: NotificationTime): { hour: number; minute: number } {
  const [hour, minute] = time.split(':').map(Number);
  return { hour, minute };
}

export async function scheduleEveningReminder(time: NotificationTime): Promise<void> {
  if (Platform.OS === 'web') return;

  await cancelEveningReminder();

  const { hour, minute } = timeToParts(time);
  const message = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDENTIFIER,
    content: {
      title: 'doneday',
      body: message,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelEveningReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(REMINDER_IDENTIFIER);
}
