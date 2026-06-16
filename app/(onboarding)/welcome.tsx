import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { BouncingImage } from '@/components/ui/BouncingImage';
import { colors, fontFamily, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.body}>
        <BouncingImage
          source={require('../../assets/images/doneday-mascot.png')}
          width={450}
          height={450}
          style={styles.mascot}
        />
        <Text style={styles.title}>doneday</Text>
        <Text style={styles.tagline}>Log three things you did today. Every day.</Text>
      </View>
      <Button
        title="Get started"
        size="extraLarge"
        onPress={() => router.push('/(onboarding)/create-account')}
      />
    </Screen>
  );
}

const styles = {
  content: {
    flex: 1,
    justifyContent: 'space-between' as const,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  body: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  mascot: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.pageTitle,
    fontFamily: fontFamily.semibold,
    fontSize: 32,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.body,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: 'center' as const,
  },
};
