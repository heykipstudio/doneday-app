import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { NumberedInput } from '@/components/ui/NumberedInput';
import { EntryRow } from '@/components/ui/EntryRow';
import { Divider } from '@/components/ui/Divider';
import { BouncingImage } from '@/components/ui/BouncingImage';
import { useAuth } from '@/hooks/useAuth';
import { useTodayEntry } from '@/hooks/useTodayEntry';
import { colors, fontFamily, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const { session } = useAuth();
  const { fields, save, isLogged } = useTodayEntry(session?.user.id);
  const [editing, setEditing] = useState(false);

  const draft = useRef(fields);
  useEffect(() => {
    draft.current = fields;
  }, [fields]);

  const input2 = useRef<TextInput>(null);
  const input3 = useRef<TextInput>(null);

  const showInputs = !isLogged || editing;

  return (
    <Screen>
      <PageTitle>{showInputs ? 'Today' : 'Today ✓'}</PageTitle>

      {showInputs ? (
        <Card>
          <NumberedInput
            index={1}
            placeholder="Something you did today..."
            defaultValue={fields.entry_1}
            onChangeText={(text) => (draft.current = { ...draft.current, entry_1: text })}
            onBlur={() => save({ entry_1: draft.current.entry_1 })}
            returnKeyType="next"
            onSubmitEditing={() => input2.current?.focus()}
          />
          <Divider />
          <NumberedInput
            ref={input2}
            index={2}
            placeholder="Something you did today..."
            defaultValue={fields.entry_2}
            onChangeText={(text) => (draft.current = { ...draft.current, entry_2: text })}
            onBlur={() => save({ entry_2: draft.current.entry_2 })}
            returnKeyType="next"
            onSubmitEditing={() => input3.current?.focus()}
          />
          <Divider />
          <NumberedInput
            ref={input3}
            index={3}
            placeholder="Something you did today..."
            defaultValue={fields.entry_3}
            onChangeText={(text) => (draft.current = { ...draft.current, entry_3: text })}
            onBlur={() => {
              save({ entry_3: draft.current.entry_3 });
              setEditing(false);
            }}
            returnKeyType="done"
            onSubmitEditing={() => input3.current?.blur()}
          />
        </Card>
      ) : (
        <>
          <Card>
            <EntryRow index={1} text={fields.entry_1} />
            <Divider />
            <EntryRow index={2} text={fields.entry_2} />
            <Divider />
            <EntryRow index={3} text={fields.entry_3} />
          </Card>
          <Pressable onPress={() => setEditing(true)} style={styles.editLink}>
            <Text style={styles.editLinkText}>Edit ✏️</Text>
          </Pressable>
        </>
      )}

      <View style={styles.mascotContainer}>
        {showInputs ? (
          <BouncingImage
            source={require('../../assets/images/hedgehog-writing.png')}
            width={250}
            height={250}
            duration={1800}
          />
        ) : (
          <BouncingImage
            source={require('../../assets/images/doneday-mascot.png')}
            width={250}
            height={250}
            duration={1800}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = {
  editLink: {
    alignSelf: 'flex-end' as const,
    marginTop: spacing.md,
  },
  editLinkText: {
    ...typography.body,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
  },
  mascotContainer: {
    alignItems: 'center' as const,
    marginTop: spacing.xxl,
  },
};
