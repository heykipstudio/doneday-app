import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { PaywallCard } from '@/components/reflect/PaywallCard';
import { ReflectionPromptCard } from '@/components/reflect/ReflectionPromptCard';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useReflections } from '@/hooks/useReflections';
import { getMonthlyReflectionPeriod, getWeeklyReflectionPeriod } from '@/lib/dateUtils';
import { MONTHLY_REFLECTION_PROMPTS, WEEKLY_REFLECTION_PROMPTS } from '@/lib/reflectionPrompts';
import { colors, spacing, typography } from '@/theme';
import type { Reflection, ReflectionPrompt, ReflectionType } from '@/types/database';

function isDue(reflection: Reflection | undefined): boolean {
  if (!reflection) return true;
  if (reflection.status === 'completed' || reflection.status === 'skipped') return false;
  if (reflection.status === 'postponed' && reflection.remind_at) {
    return new Date(reflection.remind_at) <= new Date();
  }
  return true;
}

export default function ReflectScreen() {
  const { session } = useAuth();
  const { profile, updateProfile } = useProfile(session?.user.id);
  const { reflections, saveReflection } = useReflections(session?.user.id);

  const weekly = useMemo(() => getWeeklyReflectionPeriod(), []);
  const monthly = useMemo(() => getMonthlyReflectionPeriod(), []);

  const weeklyReflection = reflections.find((r) => r.type === 'weekly' && r.period_id === weekly.periodId);
  const monthlyReflection = reflections.find(
    (r) => r.type === 'monthly' && r.period_id === monthly.periodId
  );

  const showWeekly = weekly.available && isDue(weeklyReflection);
  const showMonthly = monthly.available && isDue(monthlyReflection);

  const pastReflections = reflections
    .filter((r) => r.status === 'completed')
    .sort((a, b) => b.period_id.localeCompare(a.period_id));

  const tryFree = async () => {
    // TODO: replace with RevenueCat purchase flow
    await updateProfile({ plan: 'plus' });
  };

  const handleWrite = async (type: ReflectionType, periodId: string, answers: ReflectionPrompt[]) => {
    await saveReflection(type, periodId, { prompts: answers, status: 'completed' });
  };

  const handleSkip = async (type: ReflectionType, periodId: string) => {
    await saveReflection(type, periodId, { status: 'skipped' });
  };

  const handleRemindLater = async (type: ReflectionType, periodId: string) => {
    const remindAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await saveReflection(type, periodId, { status: 'postponed', remind_at: remindAt });
  };

  return (
    <Screen>
      <PageTitle>Reflect</PageTitle>

      {profile?.plan !== 'plus' ? (
        <PaywallCard onTryFree={tryFree} onMaybeLater={() => {}} />
      ) : (
        <>
          {showWeekly && (
            <ReflectionPromptCard
              title="Weekly reflection"
              prompts={WEEKLY_REFLECTION_PROMPTS}
              onWrite={(answers) => handleWrite('weekly', weekly.periodId, answers)}
              onSkip={() => handleSkip('weekly', weekly.periodId)}
              onRemindLater={() => handleRemindLater('weekly', weekly.periodId)}
            />
          )}

          {showMonthly && (
            <ReflectionPromptCard
              title="Monthly reflection"
              prompts={MONTHLY_REFLECTION_PROMPTS}
              onWrite={(answers) => handleWrite('monthly', monthly.periodId, answers)}
              onSkip={() => handleSkip('monthly', monthly.periodId)}
              onRemindLater={() => handleRemindLater('monthly', monthly.periodId)}
            />
          )}

          {!showWeekly && !showMonthly && (
            <Text style={styles.empty}>No reflections due right now. Check back soon.</Text>
          )}

          {pastReflections.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Past reflections</Text>
              {pastReflections.map((reflection) => (
                <Card key={reflection.id} style={styles.pastCard}>
                  <Text style={styles.pastTitle}>
                    {reflection.type === 'weekly' ? 'Weekly' : 'Monthly'} · {reflection.period_id}
                  </Text>
                  {reflection.prompts.map((p, i) => (
                    <View key={p.prompt}>
                      {i > 0 && <Divider />}
                      <View style={styles.pastPrompt}>
                        <Text style={styles.pastQuestion}>{p.prompt}</Text>
                        <Text style={styles.pastAnswer}>{p.answer || '—'}</Text>
                      </View>
                    </View>
                  ))}
                </Card>
              ))}
            </>
          )}
        </>
      )}

      <Pressable
        onPress={() => updateProfile({ plan: profile?.plan === 'plus' ? 'free' : 'plus' })}
        style={styles.devToggle}
      >
        <Text style={styles.devToggleText}>
          Dev: switch to {profile?.plan === 'plus' ? 'free' : 'plus'}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  pastCard: {
    marginBottom: spacing.lg,
  },
  pastTitle: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.md,
  },
  pastPrompt: {
    paddingVertical: spacing.sm,
  },
  pastQuestion: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pastAnswer: {
    ...typography.body,
    color: colors.textMuted,
  },
  devToggle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  devToggleText: {
    ...typography.label,
    color: colors.textMuted,
  },
});
