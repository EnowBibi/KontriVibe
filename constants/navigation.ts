/**
 * Centralized navigation constants for absolute path routing
 * Used throughout the app for consistent navigation
 */

export const ROUTES = {
  // Auth routes
  SPLASH: "/(auth)/splash",
  LOGIN: "/(auth)/login",
  SIGNUP: "/(auth)/signup",
  FORGOT_PASSWORD: "/(auth)/forgot-password",

  // Main app routes
  TABS: "/(tabs)",
  HOME: "/(tabs)",
  PROFILE: "/(tabs)/profile",
  MESSAGES: "/(tabs)/messages",
  DISCOVERY: "/(tabs)/discovery",
} as const;
