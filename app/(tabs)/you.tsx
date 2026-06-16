import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { SettingsRow } from '@/components/you/SettingsRow';
import { Toggle } from '@/components/you/Toggle';
import { TimePickerRow } from '@/components/you/TimePickerRow';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import { supabase } from '@/lib/supabase';
import {
  cancelEveningReminder,
  requestNotificationPermissions,
  scheduleEveningReminder,
} from '@/lib/notifications';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { NotificationTime } from '@/types/database';

export default function YouScreen() {
  const { session } = useAuth();
  const { profile, updateProfile } = useProfile(session?.user.id);
  const { entries } = useEntries(session?.user.id);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  const daysLogged = useMemo(
    () => entries.filter((entry) => entry.entry_1 || entry.entry_2 || entry.entry_3).length,
    [entries]
  );

  const startEditingName = () => {
    setNameDraft(profile?.name ?? '');
    setEditingName(true);
  };

  const saveName = async () => {
    setEditingName(false);
    await updateProfile({ name: nameDraft.trim() || null });
  };

  const toggleNotifications = async (enabled: boolean) => {
    await updateProfile({ notifications_enabled: enabled });

    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleEveningReminder(profile?.notification_time ?? '20:00');
      }
    } else {
      await cancelEveningReminder();
    }
  };

  const changeReminderTime = async (time: NotificationTime) => {
    await updateProfile({ notification_time: time });
    if (profile?.notifications_enabled) {
      await scheduleEveningReminder(time);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Screen>
      <PageTitle>Your space</PageTitle>

      <Card style={styles.statsCard}>
        <Text style={styles.statValue}>{daysLogged}</Text>
        <Text style={styles.statLabel}>Days logged</Text>
      </Card>

      <Text style={styles.sectionLabel}>Account</Text>
      <Card style={styles.card}>
        {editingName ? (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Name</Text>
            <TextInput
              style={styles.nameInput}
              value={nameDraft}
              onChangeText={setNameDraft}
              onBlur={saveName}
              onSubmitEditing={saveName}
              autoFocus
              returnKeyType="done"
              placeholder="Your name"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        ) : (
          <SettingsRow label="Name" value={profile?.name || 'Add your name'} onPress={startEditingName} />
        )}
        <Divider />
        <SettingsRow label="Email" value={session?.user.email ?? ''} />
        <Divider />
        <SettingsRow
          label="Plan"
          right={
            <Text style={[styles.planValue, profile?.plan === 'plus' && styles.planValuePlus]}>
              {profile?.plan === 'plus' ? 'Plus' : 'Free'}
            </Text>
          }
        />
      </Card>

      <Text style={styles.sectionLabel}>Notifications</Text>
      <Card style={styles.card}>
        <SettingsRow
          label="Evening reminder"
          right={
            <Toggle
              value={profile?.notifications_enabled ?? false}
              onValueChange={toggleNotifications}
            />
          }
        />
        {profile?.notifications_enabled ? (
          <>
            <Divider />
            <TimePickerRow
              value={profile?.notification_time ?? '20:00'}
              onChange={changeReminderTime}
            />
          </>
        ) : null}
      </Card>

      <Text style={styles.sectionLabel}>Data</Text>
      <Card>
        <SettingsRow label="Export entries" value="Coming soon" disabled />
        <Divider />
        <SettingsRow label="Appearance" value="Coming soon" disabled />
      </Card>

      <Button title="Sign out" variant="ghost" onPress={signOut} style={styles.signOut} />

      <Text style={styles.footer}>heykip.studio</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statValue: {
    ...typography.pageTitle,
    fontSize: 32,
    color: colors.text,
  },
  statLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  card: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.text,
  },
  nameInput: {
    ...typography.body,
    fontFamily: fontFamily.regular,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.lg,
  },
  planValue: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
  },
  planValuePlus: {
    color: colors.accent,
  },
  signOut: {
    marginTop: spacing.xl,
  },
  footer: {
    ...typography.label,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
});
