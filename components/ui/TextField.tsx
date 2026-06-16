import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';

type TextFieldProps = TextInputProps & {
  label?: string;
};

export function TextField({ label, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    fontFamily: fontFamily.regular,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
