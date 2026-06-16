import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, spacing } from '@/theme';
import type { NotificationTime } from '@/types/database';

const TIME_OPTIONS: NotificationTime[] = ['20:00', '21:00', '22:00'];

type TimePickerRowProps = {
  value: NotificationTime;
  onChange: (time: NotificationTime) => void;
};

export function TimePickerRow({ value, onChange }: TimePickerRowProps) {
  return (
    <View style={styles.row}>
      {TIME_OPTIONS.map((time) => {
        const active = time === value;
        return (
          <Pressable
            key={time}
            onPress={() => onChange(time)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{time}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
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
});
