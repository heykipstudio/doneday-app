import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fontFamily, spacing, typography } from '@/theme';

type SettingsRowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SettingsRow({ label, value, onPress, disabled, right, style }: SettingsRowProps) {
  const content = (
    <View style={[styles.row, disabled && styles.disabled, style]}>
      <Text style={styles.label}>{label}</Text>
      {right ?? (value !== undefined ? <Text style={styles.value}>{value}</Text> : null)}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.text,
  },
  value: {
    ...typography.body,
    color: colors.textMuted,
  },
});
