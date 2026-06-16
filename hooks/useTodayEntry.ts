import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { supabase } from '@/lib/supabase';
import { subscribeToTable } from '@/lib/realtime';
import { getCache, queuePendingWrite, setCache, storageKeys } from '@/lib/storage';
import { flushPendingWrites } from '@/lib/sync';
import { todayKey } from '@/lib/dateUtils';
import type { DailyEntry } from '@/types/database';

export type TodayEntryFields = {
  entry_1: string;
  entry_2: string;
  entry_3: string;
};

const EMPTY: TodayEntryFields = { entry_1: '', entry_2: '', entry_3: '' };

export function useTodayEntry(userId: string | undefined) {
  const dateKey = todayKey();
  const [fields, setFields] = useState<TodayEntryFields>(EMPTY);
  const [loading, setLoading] = useState(true);
  const cacheKey = storageKeys.todayEntry(dateKey);

  const load = useCallback(async () => {
    if (!userId) {
      setFields(EMPTY);
      setLoading(false);
      return;
    }

    const cached = await getCache<TodayEntryFields>(cacheKey);
    if (cached) {
      setFields(cached);
      setLoading(false);
    }

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', dateKey)
      .maybeSingle();

    if (!error && data) {
      const next: TodayEntryFields = {
        entry_1: data.entry_1 ?? '',
        entry_2: data.entry_2 ?? '',
        entry_3: data.entry_3 ?? '',
      };
      setFields(next);
      await setCache(cacheKey, next);
    }

    setLoading(false);
  }, [userId, dateKey, cacheKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime sync from other devices
  useEffect(() => {
    if (!userId) return;

    return subscribeToTable(
      `daily_entries:${userId}:${dateKey}`,
      'daily_entries',
      `user_id=eq.${userId}`,
      (payload) => {
        const row = payload.new as DailyEntry;
        if (row.entry_date !== dateKey) return;

        const next: TodayEntryFields = {
          entry_1: row.entry_1 ?? '',
          entry_2: row.entry_2 ?? '',
          entry_3: row.entry_3 ?? '',
        };
        setFields(next);
        setCache(cacheKey, next);
      }
    );
  }, [userId, dateKey, cacheKey]);

  // Flush pending writes on reconnect / foreground
  useEffect(() => {
    const netSub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        flushPendingWrites();
      }
    });

    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        flushPendingWrites();
      }
    });

    return () => {
      netSub();
      appSub.remove();
    };
  }, []);

  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (updates: Partial<TodayEntryFields>) => {
      if (!userId) return;

      const next = { ...fields, ...updates };
      setFields(next);
      setCache(cacheKey, next);

      if (saveDebounce.current) clearTimeout(saveDebounce.current);

      saveDebounce.current = setTimeout(async () => {
        const payload = {
          user_id: userId,
          entry_date: dateKey,
          ...next,
        };

        const { error } = await supabase
          .from('daily_entries')
          .upsert(payload, { onConflict: 'user_id,entry_date' });

        if (error) {
          await queuePendingWrite({
            table: 'daily_entries',
            payload,
            onConflict: 'user_id,entry_date',
          });
        }
      }, 400);
    },
    [fields, userId, dateKey, cacheKey]
  );

  const isLogged = Boolean(fields.entry_1 || fields.entry_2 || fields.entry_3);

  return { fields, loading, save, isLogged, dateKey };
}
