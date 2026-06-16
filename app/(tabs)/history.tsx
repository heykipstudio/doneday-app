import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { SearchBar } from '@/components/ui/SearchBar';
import { Card } from '@/components/ui/Card';
import { EntryRow } from '@/components/ui/EntryRow';
import { Divider } from '@/components/ui/Divider';
import { useAuth } from '@/hooks/useAuth';
import { useEntries } from '@/hooks/useEntries';
import { dateKeyMatches, formatDateLabel, parseFlexibleDate } from '@/lib/dateUtils';
import { colors, spacing, typography } from '@/theme';

export default function HistoryScreen() {
  const { session } = useAuth();
  const { entries } = useEntries(session?.user.id);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return entries;

    const parsedDate = parseFlexibleDate(trimmed);
    if (parsedDate) {
      return entries.filter((entry) => dateKeyMatches(entry.entry_date, parsedDate));
    }

    const needle = trimmed.toLowerCase();
    return entries.filter((entry) =>
      [entry.entry_1, entry.entry_2, entry.entry_3].some((text) =>
        text?.toLowerCase().includes(needle)
      )
    );
  }, [entries, query]);

  return (
    <Screen>
      <PageTitle>History</PageTitle>
      <SearchBar
        placeholder="Search by word or date..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />

      {filtered.length === 0 ? (
        <Text style={styles.empty}>Nothing here yet.</Text>
      ) : (
        filtered.map((entry) => (
          <View key={entry.id} style={styles.section}>
            <Text style={styles.dateLabel}>{formatDateLabel(entry.entry_date)}</Text>
            <Card>
              <EntryRow index={1} text={entry.entry_1 ?? ''} />
              <Divider />
              <EntryRow index={2} text={entry.entry_2 ?? ''} />
              <Divider />
              <EntryRow index={3} text={entry.entry_3 ?? ''} />
            </Card>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  dateLabel: {
    ...typography.label,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
