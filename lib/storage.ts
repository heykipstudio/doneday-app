import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  onboardingComplete: 'onboarding_complete',
  profile: 'cache:profile',
  entries: 'cache:entries:all',
  reflections: 'cache:reflections',
  todayEntry: (date: string) => `cache:today_entry:${date}`,
  pendingWrites: 'pending_writes',
} as const;

export type PendingWrite = {
  table: 'daily_entries' | 'reflections' | 'profiles';
  payload: Record<string, unknown>;
  onConflict: string;
};

export async function queuePendingWrite(write: PendingWrite): Promise<void> {
  const queue = (await getCache<PendingWrite[]>(storageKeys.pendingWrites)) ?? [];
  queue.push(write);
  await setCache(storageKeys.pendingWrites, queue);
}

export async function getPendingWrites(): Promise<PendingWrite[]> {
  return (await getCache<PendingWrite[]>(storageKeys.pendingWrites)) ?? [];
}

export async function setPendingWrites(queue: PendingWrite[]): Promise<void> {
  await setCache(storageKeys.pendingWrites, queue);
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
