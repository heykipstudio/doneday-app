import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { setCache, storageKeys } from '@/lib/storage';
import { colors, fontFamily, spacing, typography } from '@/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    await setCache(storageKeys.onboardingComplete, true);
    router.replace('/(tabs)/today');
  };

  return (
    <Screen>
      <PageTitle>Welcome back</PageTitle>

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

      <Button title={loading ? 'Signing in...' : 'Sign in'} onPress={handleSignIn} disabled={loading} />

      <Pressable onPress={() => router.replace('/(onboarding)/welcome')} style={styles.linkRow}>
        <Text style={styles.linkText}>New here? Create an account</Text>
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
