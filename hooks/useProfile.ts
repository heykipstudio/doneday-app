import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { subscribeToTable } from '@/lib/realtime';
import { getCache, setCache, storageKeys } from '@/lib/storage';
import type { Profile } from '@/types/database';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const cached = await getCache<Profile>(storageKeys.profile);
    if (cached && cached.id === userId) {
      setProfile(cached);
      setLoading(false);
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (!error && data) {
      setProfile(data);
      await setCache(storageKeys.profile, data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;

    return subscribeToTable(`profile:${userId}`, 'profiles', `id=eq.${userId}`, (payload) => {
      const updated = payload.new as Profile;
      setProfile(updated);
      setCache(storageKeys.profile, updated);
    });
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!userId) return;

      setProfile((prev) => (prev ? { ...prev, ...updates } : prev));

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        await setCache(storageKeys.profile, data);
      }
    },
    [userId]
  );

  return { profile, loading, updateProfile, refresh };
}
