/*-----------------------------------------------------------------------------------------------------
| @blocktype lyricsGeneratorScreen
| @brief    Main AI lyrics generation screen for KontriVibe mobile app with form and results display
| @param    --
| @return   React Native component with lyrics generation UI
-----------------------------------------------------------------------------------------------------*/

import LyricsResultCard from "@/components/LyricsResultCard";
import OptionSelector from "@/components/OptionSelector";
import { useLyricsGenerator } from "@/hooks/useLyricsGenerator";
import styles from "@/styles/lyricsGenerator.styles";
import type { GenerateLyricsRequest } from "@/types/lyrics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  const { generateLyrics, loading, error, lyrics, generatedMetadata } =
    useLyricsGenerator();

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Generate Lyrics</Text>
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
              <Text style={styles.label}>Additional Details (Optional)</Text>
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
                <Text style={styles.generateButtonText}>Generate Lyrics</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Results Section */}
        {lyrics && generatedMetadata && (
          <LyricsResultCard
            lyrics={lyrics}
            metadata={generatedMetadata}
            onRegeneratePress={handleClear}
            onDownloadPress={() => {
              Alert.alert("Save Lyrics", "Lyrics saved to your library", [
                { text: "OK" },
              ]);
            }}
          />
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Generating your lyrics...</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
