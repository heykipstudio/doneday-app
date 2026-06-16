import { supabase } from '@/lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Listener = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;

const listenersByTopic = new Map<string, Set<Listener>>();
const channelsByTopic = new Map<string, RealtimeChannel>();

/**
 * Multiple components may want to subscribe to the same table/filter at
 * once (e.g. profile shown on both Your Space and Reflect). Supabase
 * returns the same channel instance for a given topic and throws if you
 * call `.on('postgres_changes', ...)` on a channel that's already
 * subscribed, so we register a single channel per topic and fan out
 * updates to all listeners.
 */
export function subscribeToTable(
  topic: string,
  table: string,
  filter: string,
  listener: Listener
): () => void {
  let listeners = listenersByTopic.get(topic);

  if (!listeners) {
    listeners = new Set();
    listenersByTopic.set(topic, listeners);

    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          listenersByTopic.get(topic)?.forEach((l) => l(payload));
        }
      )
      .subscribe();

    channelsByTopic.set(topic, channel);
  }

  listeners.add(listener);

  return () => {
    const current = listenersByTopic.get(topic);
    if (!current) return;

    current.delete(listener);

    if (current.size === 0) {
      const channel = channelsByTopic.get(topic);
      if (channel) {
        supabase.removeChannel(channel);
        channelsByTopic.delete(topic);
      }
      listenersByTopic.delete(topic);
    }
  };
}
