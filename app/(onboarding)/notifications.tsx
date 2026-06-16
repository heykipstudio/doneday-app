import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/Button';
import { setCache, storageKeys } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  requestNotificationPermissions,
  scheduleEveningReminder,
} from '@/lib/notifications';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { NotificationTime } from '@/types/database';

const TIME_OPTIONS: NotificationTime[] = ['20:00', '21:00', '22:00'];

export default function NotificationsOnboardingScreen() {
  const { session } = useAuth();
  const { updateProfile } = useProfile(session?.user.id);
  const [selectedTime, setSelectedTime] = useState<NotificationTime>('20:00');

  const finish = async () => {
    await setCache(storageKeys.onboardingComplete, true);
    router.replace('/(tabs)/today');
  };

  const enableReminders = async () => {
    const granted = await requestNotificationPermissions();

    if (granted) {
      await scheduleEveningReminder(selectedTime);
    }

    await updateProfile({
      notifications_enabled: granted,
      notification_time: selectedTime,
    });

    await finish();
  };

  const notNow = async () => {
    await updateProfile({ notifications_enabled: false });
    await finish();
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.body}>
        <PageTitle>One more thing</PageTitle>
        <Text style={styles.text}>Want a reminder to log your dones each evening?</Text>

        <View style={styles.pills}>
          {TIME_OPTIONS.map((time) => {
            const active = time === selectedTime;
            return (
              <Pressable
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{time}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="Enable reminders" onPress={enableReminders} />
        <Button title="Not now" variant="ghost" onPress={notNow} style={styles.notNow} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    ...typography.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  pills: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  pill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.buttonBg,
    borderColor: colors.buttonBg,
  },
  pillText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.text,
  },
  pillTextActive: {
    color: colors.buttonText,
  },
  actions: {
    gap: spacing.sm,
  },
  notNow: {
    marginTop: spacing.sm,
  },
});
