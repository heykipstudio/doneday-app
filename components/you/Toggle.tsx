import { Switch } from 'react-native';
import { colors } from '@/theme';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={colors.surface}
    />
  );
}
