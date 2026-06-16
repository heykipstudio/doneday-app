import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing, typography } from '@/theme';

type EntryRowProps = {
  index: number;
  text: string;
};

export function EntryRow({ index, text }: EntryRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.number}>{index}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
  },
  number: {
    ...typography.body,
    fontFamily: fontFamily.semibold,
    color: colors.accent,
    width: 20,
  },
  text: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
});
