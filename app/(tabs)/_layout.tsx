import { Tabs } from 'expo-router';
import { PillTabBar } from '@/components/ui/PillTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="today" options={{ title: 'Today' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="reflect" options={{ title: 'Reflect' }} />
      <Tabs.Screen name="you" options={{ title: 'You' }} />
    </Tabs>
  );
}
