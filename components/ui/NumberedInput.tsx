import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fontFamily, spacing, typography } from '@/theme';

type NumberedInputProps = TextInputProps & {
  index: number;
};

export const NumberedInput = forwardRef<TextInput, NumberedInputProps>(
  ({ index, style, ...props }, ref) => {
    return (
      <View style={styles.row}>
        <Text style={styles.number}>{index}</Text>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.placeholder}
          {...props}
        />
      </View>
    );
  }
);

NumberedInput.displayName = 'NumberedInput';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  number: {
    ...typography.body,
    fontFamily: fontFamily.semibold,
    color: colors.accent,
    width: 20,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 0,
  },
});
