import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { subscribeToTable } from '@/lib/realtime';
import { getCache, setCache, storageKeys } from '@/lib/storage';
import type { Reflection, ReflectionPrompt, ReflectionStatus, ReflectionType } from '@/types/database';

export function useReflections(userId: string | undefined) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setReflections([]);
      setLoading(false);
      return;
    }

    const cached = await getCache<Reflection[]>(storageKeys.reflections);
    if (cached) {
      setReflections(cached);
      setLoading(false);
    }

    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('period_id', { ascending: false });

    if (!error && data) {
      setReflections(data);
      await setCache(storageKeys.reflections, data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;

    return subscribeToTable(
      `reflections:${userId}`,
      'reflections',
      `user_id=eq.${userId}`,
      () => {
        refresh();
      }
    );
  }, [userId, refresh]);

  const saveReflection = useCallback(
    async (
      type: ReflectionType,
      periodId: string,
      updates: { prompts?: ReflectionPrompt[]; status: ReflectionStatus; remind_at?: string | null }
    ) => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('reflections')
        .upsert(
          {
            user_id: userId,
            type,
            period_id: periodId,
            ...updates,
          },
          { onConflict: 'user_id,type,period_id' }
        )
        .select()
        .single();

      if (!error && data) {
        await refresh();
      }
    },
    [userId, refresh]
  );

  return { reflections, loading, saveReflection, refresh };
}
