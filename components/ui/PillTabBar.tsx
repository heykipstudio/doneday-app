import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/theme';

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  today: 'check',
  history: 'clock',
  reflect: 'message-circle',
  you: 'user',
};

export function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + spacing.lg }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = ICONS[route.name] ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View key={route.key} style={styles.tabWrapper}>
              <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.title ?? route.name}
                style={styles.tabPressable}
              >
                <View style={[styles.iconCircle, isFocused && styles.iconCircleActive]}>
                  <Feather
                    name={iconName}
                    size={20}
                    color={isFocused ? colors.text : colors.textMuted}
                  />
                </View>
              </Pressable>
              {index < state.routes.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabPressable: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: colors.background,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
});
