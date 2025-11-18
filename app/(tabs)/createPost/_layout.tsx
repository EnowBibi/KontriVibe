// app/(auth)/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function CreatePostLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="uploadSong" />
        <Stack.Screen name="lyricsGenerator" />
        <Stack.Screen name="post" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
