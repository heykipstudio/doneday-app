import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/theme';

type PaywallCardProps = {
  onTryFree: () => void;
  onMaybeLater: () => void;
};

export function PaywallCard({ onTryFree, onMaybeLater }: PaywallCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.emoji}>💭</Text>
      <Text style={styles.text}>Unlock weekly and monthly reflections with Doneday Plus.</Text>
      <Button title="Try free for 7 days" onPress={onTryFree} style={styles.button} />
      <Button title="Maybe later" variant="ghost" onPress={onMaybeLater} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emoji: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
