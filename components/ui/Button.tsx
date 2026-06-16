import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fontFamily, radius, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'ghost';
type ButtonSize = 'default' | 'extraLarge';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', size = 'default', disabled, style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isLarge = size === 'extraLarge';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        isLarge && styles.large,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.ghostText,
          isLarge && styles.largeText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.buttonBg,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  largeText: {
    fontSize: 15,
  },
  primaryText: {
    color: colors.buttonText,
  },
  ghostText: {
    color: colors.text,
  },
});
