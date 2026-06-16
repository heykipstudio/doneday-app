import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export function PageTitle({ style, ...props }: TextProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

const styles = StyleSheet.create({
  title: {
    ...typography.pageTitle,
    color: colors.text,
    marginBottom: spacing.xl,
  },
});
