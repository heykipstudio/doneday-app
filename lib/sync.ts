import { supabase } from '@/lib/supabase';
import { getPendingWrites, setPendingWrites } from '@/lib/storage';

export async function flushPendingWrites(): Promise<void> {
  const queue = await getPendingWrites();
  if (queue.length === 0) return;

  const remaining: typeof queue = [];

  for (const write of queue) {
    const { error } = await supabase
      .from(write.table)
      .upsert(write.payload as never, { onConflict: write.onConflict });

    if (error) {
      remaining.push(write);
    }
  }

  await setPendingWrites(remaining);
}
