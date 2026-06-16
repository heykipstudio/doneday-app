import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getCache, storageKeys } from '@/lib/storage';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    getCache<boolean>(storageKeys.onboardingComplete).then((value) => {
      setOnboardingComplete(Boolean(value));
    });
  }, []);

  if (authLoading || onboardingComplete === null) {
    return null;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
