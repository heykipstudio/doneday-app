import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { ReflectionPrompt } from '@/types/database';

type ReflectionPromptCardProps = {
  title: string;
  prompts: string[];
  onWrite: (answers: ReflectionPrompt[]) => void;
  onSkip: () => void;
  onRemindLater: () => void;
};

export function ReflectionPromptCard({
  title,
  prompts,
  onWrite,
  onSkip,
  onRemindLater,
}: ReflectionPromptCardProps) {
  const [answers, setAnswers] = useState(() => prompts.map(() => ''));

  const setAnswer = (index: number, value: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  };

  const write = () => {
    onWrite(prompts.map((prompt, i) => ({ prompt, answer: answers[i].trim() })));
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {prompts.map((prompt, i) => (
        <View key={prompt} style={styles.promptBlock}>
          <Text style={styles.prompt}>{prompt}</Text>
          <TextInput
            style={styles.input}
            value={answers[i]}
            onChangeText={(value) => setAnswer(i, value)}
            placeholder="Write your answer..."
            placeholderTextColor={colors.placeholder}
            multiline
          />
        </View>
      ))}

      <Button title="Write reflection" onPress={write} style={styles.button} />
      <View style={styles.row}>
        <Button title="Skip" variant="ghost" onPress={onSkip} style={styles.halfButton} />
        <Button title="Remind me later" variant="ghost" onPress={onRemindLater} style={styles.halfButton} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.pageTitle,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  promptBlock: {
    marginBottom: spacing.lg,
  },
  prompt: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
});
