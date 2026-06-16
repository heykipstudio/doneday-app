import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { setCache, storageKeys } from '@/lib/storage';
import { colors, fontFamily, spacing, typography } from '@/theme';

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setInfo('Check your email to confirm your account, then sign in.');
      return;
    }

    await setCache(storageKeys.onboardingComplete, true);
    router.replace('/(onboarding)/notifications');
  };

  return (
    <Screen>
      <PageTitle>Create your account</PageTitle>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {info ? <Text style={styles.info}>{info}</Text> : null}

      <Button
        title={loading ? 'Creating account...' : 'Create account'}
        onPress={handleCreateAccount}
        disabled={loading}
      />

      <Pressable onPress={() => router.replace('/(auth)/sign-in')} style={styles.linkRow}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </Pressable>
    </Screen>
  );
}

const styles = {
  error: {
    ...typography.body,
    color: colors.accent,
    marginBottom: spacing.lg,
  },
  info: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  linkRow: {
    marginTop: spacing.xl,
    alignItems: 'center' as const,
  },
  linkText: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
  },
};
