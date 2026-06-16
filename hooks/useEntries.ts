import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { subscribeToTable } from '@/lib/realtime';
import { getCache, setCache, storageKeys } from '@/lib/storage';
import type { DailyEntry } from '@/types/database';

export function useEntries(userId: string | undefined) {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const cached = await getCache<DailyEntry[]>(storageKeys.entries);
    if (cached) {
      setEntries(cached);
      setLoading(false);
    }

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (!error && data) {
      setEntries(data);
      await setCache(storageKeys.entries, data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;

    return subscribeToTable(
      `daily_entries_list:${userId}`,
      'daily_entries',
      `user_id=eq.${userId}`,
      () => {
        refresh();
      }
    );
  }, [userId, refresh]);

  return { entries, loading, refresh };
}
