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
import React from "react";

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
        <Stack.Screen name="LibraryScreen"/>
      
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
