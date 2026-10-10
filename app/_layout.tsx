// Root layout with providers
import { Stack } from 'expo-router';
import { TaskProvider } from '@/contexts/TaskContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="categories" />
        </Stack>
      </TaskProvider>
    </ThemeProvider>
  );
}
