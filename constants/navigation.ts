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
  VERIFY_CODE: "/verify-code",
  UPLOAD_PROFILE_PICTURE: "/upload-pp",

  // Main app routes
  TABS: "/(tabs)",
  HOME: "/(tabs)",
  PROFILE: "/(tabs)/profile",
  MESSAGES: "/(tabs)/messages",
  DISCOVERY: "/(tabs)/discovery",
  LYRICS_GENERATOR: "/(tabs)/createPost/lyricsGenerator",
  POST: "/(tabs)/createPost/post",
  UPLOAD_SONG: "/(tabs)/createPost/uploadSong",
  CREATE: "/(tabs)/createPost",
  PLAY_AUDIO: "/play-audio-screen",
} as const;
