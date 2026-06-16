import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';

export function SearchBar(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={colors.placeholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
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
    marginBottom: spacing.xl,
  },
});
