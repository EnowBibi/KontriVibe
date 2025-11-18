import LyricsResultCard from "@/components/LyricsResultCard";
import OptionSelector from "@/components/OptionSelector";
import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import styles from "@/styles/lyricsGenerator.styles";
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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/*-----------------------------------------------------------------------------------------------------
| @blocktype Types
| @brief    TypeScript interfaces for AI lyrics generation feature
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

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

interface LyricsHistory {
  id: string;
  lyrics: string;
  theme: string;
  mood: string;
  genre: string;
  createdAt: string;
  isSaved: boolean;
}

interface APIError {
  success: false;
  message: string;
  code?: string;
}

/*-----------------------------------------------------------------------------------------------------
| @blocktype useLyricsGenerator
| @brief    Custom hook managing AI lyrics generation state and API communication
| @param    --
| @return   { generateLyrics, loading, error, lyrics, clearLyrics, generatedMetadata }
-----------------------------------------------------------------------------------------------------*/

const useLyricsGenerator = () => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
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

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

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

/*-----------------------------------------------------------------------------------------------------
| @component LyricsGeneratorScreen
| @brief    Renders the AI lyrics generator interface with input form and generated lyrics display
| @param    --
| @return   JSX.Element
-----------------------------------------------------------------------------------------------------*/
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

  /*-----------------------------------------------------------------------------------------------------
  | @function handleGenerateLyrics
  | @brief    Validates form inputs and triggers lyrics generation API call
  | @param    --
  | @return   --
  | @side-effect Sets error alert if validation fails
  ----------------------------------------------------------------------------------------------------*/
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

  /*-----------------------------------------------------------------------------------------------------
  | @function handleClear
  | @brief    Clears all form inputs and generated lyrics
  | @param    --
  | @return   --
  ----------------------------------------------------------------------------------------------------*/
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
      <View
      // style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          //style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => router.replace(ROUTES.CREATE)}>
                  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Generate Lyrics</Text>
              </View>
              <Text style={styles.screenSubtitle}>
                Create unique lyrics powered by AI
              </Text>
            </View>

            {/* Form Section - Only show when no lyrics generated or on edit */}
            {!lyrics && (
              <View style={styles.formSection}>
                {/* Theme Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Theme or Story</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Love, struggle, triumph, cultural pride"
                    placeholderTextColor="#999"
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
                <OptionSelector
                  label="Select Mood"
                  options={moodOptions}
                  selectedOption={selectedMood}
                  onSelect={setSelectedMood}
                />

                {/* Genre Selector */}
                <OptionSelector
                  label="Select Genre"
                  options={genreOptions}
                  selectedOption={selectedGenre}
                  onSelect={setSelectedGenre}
                />

                {/* Custom Prompt (Optional) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Additional Details (Optional)
                  </Text>
                  <TextInput
                    style={[styles.textInput, styles.largeInput]}
                    placeholder="Add any specific requests or style notes"
                    placeholderTextColor="#999"
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
                    <Text style={styles.generateButtonText}>
                      Generate Lyrics
                    </Text>
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
                  // <CHANGE> Clear lyrics and reset form to generate new ones
                  clearLyrics();
                  handleClear();
                }}
                onDownloadPress={() => {
                  // <CHANGE> Handle save lyrics to library
                  Alert.alert("Success", "Lyrics saved to your library");
                }}
                onBackPress={() => {
                  // <CHANGE> Go back to lyrics generator form
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
