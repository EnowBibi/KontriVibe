import LyricsResultCard from "@/components/LyricsResultCard";
import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Mood = "happy" | "sad" | "energetic" | "calm" | "romantic" | "melancholic";
type Genre =
  | "afrobeats"
  | "hiphop"
  | "highlife"
  | "reggae"
  | "pop"
  | "jazz"
  | "traditional";

interface GenerateLyricsRequest {
  theme: string;
  mood: string;
  genre: string;
  language?: "en" | "fr" | "pid";
  customPrompt?: string;
}

interface GenerateLyricsResponse {
  success: boolean;
  lyrics: string;
  theme: string;
  mood: string;
  genre: string;
  generatedAt: string;
  contentId?: string;
}

interface APIError {
  success: false;
  message: string;
  code?: string;
}

const useLyricsGenerator = () => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMetadata, setGeneratedMetadata] = useState<{
    theme: string;
    mood: string;
    genre: string;
  } | null>(null);

  const generateLyrics = useCallback(async (request: GenerateLyricsRequest) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("authToken");

      // For demo purposes if no backend
      if (!token) {
        // throw new Error("Authentication token not found. Please login again.");
      }

      // Simulate API call for UI testing if needed
      /*
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLyrics(`(Verse 1)
In the heart of the city where the rhythm beats loud
Walking through the market, moving with the crowd
Colors everywhere, stories in the air
This is my home, nothing can compare

(Chorus)
Oh oh oh, feel the energy
Rising up like the sun, setting us free
From the mountains to the sea
This is where I want to be`);
      setGeneratedMetadata({
        theme: request.theme,
        mood: request.mood,
        genre: request.genre,
      });
      setLoading(false);
      return;
      */

      const response = await fetch(`${BASE_URL}/api/ai/lyrics/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const data: GenerateLyricsResponse | APIError = await response.json();

      if (!response.ok) {
        const error = data as APIError;
        throw new Error(error.message || "Failed to generate lyrics");
      }

      const result = data as GenerateLyricsResponse;
      setLyrics(result.lyrics);
      setGeneratedMetadata({
        theme: result.theme,
        mood: result.mood,
        genre: result.genre,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("[Lyrics Generation Error]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLyrics = useCallback(() => {
    setLyrics(null);
    setGeneratedMetadata(null);
    setError(null);
  }, []);

  return {
    generateLyrics,
    loading,
    error,
    lyrics,
    generatedMetadata,
    clearLyrics,
  };
};

export default function LyricsGeneratorScreen() {
  const [theme, setTheme] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const {
    generateLyrics,
    loading,
    error,
    lyrics,
    generatedMetadata,
    clearLyrics,
  } = useLyricsGenerator();

  const moodOptions: Mood[] = [
    "happy",
    "sad",
    "energetic",
    "calm",
    "romantic",
    "melancholic",
  ];
  const genreOptions: Genre[] = [
    "afrobeats",
    "hiphop",
    "highlife",
    "reggae",
    "pop",
    "jazz",
    "traditional",
  ];

  const handleGenerateLyrics = async () => {
    if (!theme.trim()) {
      Alert.alert("Validation Error", "Please enter a theme for your lyrics");
      return;
    }

    if (!selectedMood) {
      Alert.alert("Validation Error", "Please select a mood");
      return;
    }

    if (!selectedGenre) {
      Alert.alert("Validation Error", "Please select a genre");
      return;
    }

    const request: GenerateLyricsRequest = {
      theme: theme.trim(),
      mood: selectedMood,
      genre: selectedGenre,
      language: "en",
      customPrompt: customPrompt.trim() || undefined,
    };

    await generateLyrics(request);
  };

  const handleClear = () => {
    setTheme("");
    setSelectedMood(null);
    setSelectedGenre(null);
    setCustomPrompt("");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/img-bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.replace(ROUTES.CREATE)}>
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Generate Lyrics</Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Form Section - Only show when no lyrics generated or on edit */}
            {!lyrics && (
              <View style={styles.formSection}>
                <Text style={styles.screenSubtitle}>
                  Create unique lyrics powered by AI
                </Text>

                {/* Theme Input */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="bulb" size={18} color="#FF6B35" />
                    <Text style={styles.sectionLabel}>Theme or Story</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Love, struggle, triumph, cultural pride"
                    placeholderTextColor="#718096"
                    value={theme}
                    onChangeText={setTheme}
                    multiline
                    maxLength={200}
                  />
                  <Text style={styles.charCount}>
                    {theme.length}/200 characters
                  </Text>
                </View>

                {/* Mood Selector */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="happy" size={18} color="#FF6B35" />
                    <Text style={styles.sectionLabel}>Select Mood</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.optionsScroll}
                  >
                    {moodOptions.map((mood) => (
                      <TouchableOpacity
                        key={mood}
                        style={[
                          styles.optionButton,
                          selectedMood === mood && styles.optionButtonSelected,
                        ]}
                        onPress={() => setSelectedMood(mood)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedMood === mood && styles.optionTextSelected,
                          ]}
                        >
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Genre Selector */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="musical-notes" size={18} color="#FF6B35" />
                    <Text style={styles.sectionLabel}>Select Genre</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.optionsScroll}
                  >
                    {genreOptions.map((genre) => (
                      <TouchableOpacity
                        key={genre}
                        style={[
                          styles.optionButton,
                          selectedGenre === genre &&
                            styles.optionButtonSelected,
                        ]}
                        onPress={() => setSelectedGenre(genre)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedGenre === genre &&
                              styles.optionTextSelected,
                          ]}
                        >
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Custom Prompt (Optional) */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="options" size={18} color="#FF6B35" />
                    <Text style={styles.sectionLabel}>
                      Additional Details (Optional)
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, styles.largeInput]}
                    placeholder="Add any specific requests or style notes"
                    placeholderTextColor="#718096"
                    value={customPrompt}
                    onChangeText={setCustomPrompt}
                    multiline
                    maxLength={300}
                  />
                  <Text style={styles.charCount}>
                    {customPrompt.length}/300 characters
                  </Text>
                </View>

                {/* Error Display */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Generate Button */}
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    loading && styles.generateButtonDisabled,
                  ]}
                  onPress={handleGenerateLyrics}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                      <Text style={styles.generateButtonText}>
                        Generate Lyrics
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Results Section */}
            {lyrics && generatedMetadata && (
              <LyricsResultCard
                lyrics={lyrics}
                metadata={generatedMetadata}
                onRegeneratePress={() => {
                  clearLyrics();
                  handleClear();
                }}
                onDownloadPress={() => {
                  Alert.alert("Success", "Lyrics saved to your library");
                }}
                onBackPress={() => {
                  clearLyrics();
                  handleClear();
                }}
              />
            )}

            {/* Loading State */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>
                  Generating your lyrics...
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.6)",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginBottom: 24,
  },
  formSection: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
  },
  textInput: {
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.25)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 14,
    minHeight: 50,
    fontWeight: "500",
  },
  largeInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#888888",
    marginTop: 6,
    textAlign: "right",
  },
  optionsScroll: {
    paddingRight: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
  },
  optionButtonSelected: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    borderColor: "#FF6B35",
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888888",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  generateButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 16,
    marginTop: 12,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  errorContainer: {
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#d32f2f",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff8a80",
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#888888",
    marginTop: 12,
  },
});
