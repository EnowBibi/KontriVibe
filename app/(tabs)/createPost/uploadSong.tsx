/*-----------------------------------------------------------------------------------------------------
 | @screen UploadSongScreen
 | @brief    Screen for artists to upload new songs with audio and cover image
 | @param    --
 | @return   React.JSX.Element
 ----------------------------------------------------------------------------------------------------*/

import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GENRES = [
  "Afrobeats",
  "Makossa",
  "Bikutsi",
  "Hip Hop",
  "R&B",
  "Gospel",
  "Mbolé",
  "Highlife",
];
const MOODS = [
  "Happy",
  "Sad",
  "Energetic",
  "Chill",
  "Romantic",
  "Party",
  "Inspirational",
];

const UploadSongScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [audioFile, setAudioFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  /*-------------------------------------------------------------------------------------------------
   | @function handlePickCover
   | @brief    Opens image picker for song cover art
   ----------------------------------------------------------------------------------------------------*/
  const handlePickCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setCoverUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handlePickAudio
   | @brief    Opens document picker for audio file
   ----------------------------------------------------------------------------------------------------*/
  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setAudioFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick audio file");
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handleUpload
   | @brief    Uploads song data and files to backend
   ----------------------------------------------------------------------------------------------------*/
  const handleUpload = async () => {
    if (!title.trim() || !audioFile || !coverUri) {
      Alert.alert(
        "Error",
        "Please provide a title, cover image, and audio file"
      );
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("genre", genre);
      formData.append("mood", mood);
      formData.append("durationSec", "180"); // Placeholder, ideally get real duration

      // Append Cover Image
      const coverFilename = coverUri.split("/").pop() || "cover.jpg";
      formData.append("coverImage", {
        uri: coverUri,
        type: "image/jpeg",
        name: coverFilename,
      } as any);

      // Append Audio File
      formData.append("audioFile", {
        uri: audioFile.uri,
        type: audioFile.mimeType || "audio/mpeg",
        name: audioFile.name,
      } as any);

      const response = await fetch(`${BASE_URL}/api/songs/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload song");
      }

      Alert.alert("Success", "Song uploaded successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to upload song");
      console.error("[UploadSong] Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/img-bg.jpg")}
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace(ROUTES.CREATE)}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Song</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image Picker */}
          <TouchableOpacity
            style={styles.coverPicker}
            onPress={handlePickCover}
          >
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={40} color="#FF6B35" />
                <Text style={styles.coverPlaceholderText}>Add Cover Art</Text>
              </View>
            )}
            <View style={styles.editIconBadge}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Song Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter song title"
              placeholderTextColor="#888888"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Audio File Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Audio File</Text>
            <TouchableOpacity
              style={[styles.fileButton, audioFile && styles.fileButtonActive]}
              onPress={handlePickAudio}
            >
              <Ionicons
                name={audioFile ? "musical-note" : "cloud-upload-outline"}
                size={24}
                color={audioFile ? "#FF6B35" : "#888888"}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.fileButtonText,
                    audioFile && styles.fileButtonTextActive,
                  ]}
                >
                  {audioFile ? audioFile.name : "Select Audio File"}
                </Text>
                {audioFile && (
                  <Text style={styles.fileSizeText}>
                    {(audioFile.size
                      ? audioFile.size / 1024 / 1024
                      : 0
                    ).toFixed(2)}{" "}
                    MB
                  </Text>
                )}
              </View>
              {audioFile && (
                <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
              )}
            </TouchableOpacity>
          </View>

          {/* Genre Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsContainer}
            >
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.tag, genre === g && styles.tagActive]}
                  onPress={() => setGenre(g)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      genre === g && styles.tagTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Mood Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mood</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsContainer}
            >
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.tag, mood === m && styles.tagActive]}
                  onPress={() => setMood(m)}
                >
                  <Text
                    style={[styles.tagText, mood === m && styles.tagTextActive]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your song..."
              placeholderTextColor="#888888"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Upload Song</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default UploadSongScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.85)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  coverPicker: {
    alignSelf: "center",
    marginBottom: 30,
    position: "relative",
  },
  coverImage: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  coverPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 107, 53, 0.3)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  coverPlaceholderText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
  },
  editIconBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#FF6B35",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0F1419",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  fileButtonActive: {
    borderColor: "#FF6B35",
    backgroundColor: "rgba(255, 107, 53, 0.05)",
  },
  fileButtonText: {
    color: "#888888",
    fontSize: 16,
  },
  fileButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  fileSizeText: {
    color: "#888888",
    fontSize: 12,
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: "row",
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 10,
  },
  tagActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  tagText: {
    color: "#888888",
    fontSize: 14,
    fontWeight: "500",
  },
  tagTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
