/*-----------------------------------------------------------------------------------------------------
 | @screen PostScreen
 | @brief    TikTok-like post creation screen for KontriVibe with media upload, captions, and challenge linking
 | @param    --
 | @return   React.JSX.Element
 ----------------------------------------------------------------------------------------------------*/

import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Challenge {
  _id: string;
  title: string;
  description: string;
}

interface Song {
  _id: string;
  title: string;
  artist: string;
}

const PostScreen = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);

  /*-------------------------------------------------------------------------------------------------
   | @function handlePickMedia
   | @brief    Opens image/video picker and stores selected media URI
   | @param    mediaType - 'image' or 'video'
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handlePickMedia = async (type: "image" | "video") => {
    try {
      const result =
        type === "image"
          ? await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [9, 16],
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Videos,
              allowsEditing: true,
              aspect: [9, 16],
            });

      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType(type);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick media");
      console.error("[PostScreen] Media pick error:", error);
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handleCameraCapture
   | @brief    Launches camera to capture photo or video
   | @param    mediaType - 'image' or 'video'
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleCameraCapture = async (type: "image" | "video") => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes:
          type === "image"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType(type);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture media");
      console.error("[PostScreen] Camera error:", error);
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function fetchChallenges
   | @brief    Fetches available challenges for post linking
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/challenges`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChallenges(data.data || []);
      }
    } catch (error) {
      console.error("[PostScreen] Challenge fetch error:", error);
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function fetchSongs
   | @brief    Fetches available songs for post linking
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const fetchSongs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/songs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSongs(data.data || []);
      }
    } catch (error) {
      console.error("[PostScreen] Song fetch error:", error);
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handleCreatePost
   | @brief    Creates post with media upload to Cloudinary and saves to database
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please add a caption for your post");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      const formData = new FormData();
      formData.append("authorId", userId || "");
      formData.append("content", content);
      formData.append("visibility", visibility);
      formData.append("relatedChallengeId", selectedChallenge?._id || "");
      formData.append("relatedSongId", selectedSong?._id || "");
      formData.append("aiGenerated", "false");

      if (mediaUri) {
        formData.append("media", {
          uri: mediaUri,
          type: mediaType === "image" ? "image/jpeg" : "video/mp4",
          name: `post-${Date.now()}.${mediaType === "image" ? "jpg" : "mp4"}`,
        } as any);
      }

      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      Alert.alert("Success", "Post created successfully!");
      router.replace(ROUTES.TABS);
    } catch (error) {
      Alert.alert("Error", "Failed to create post");
      console.error("[PostScreen] Create post error:", error);
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Media Preview Section */}
          {mediaUri ? (
            <View style={styles.mediaPreviewContainer}>
              <ImageBackground
                source={{ uri: mediaUri }}
                style={styles.mediaPreview}
              >
                <TouchableOpacity
                  style={styles.changeMediaBtn}
                  onPress={() => setMediaUri(null)}
                >
                  <Ionicons name="close-circle" size={32} color="#FFFFFF" />
                </TouchableOpacity>
              </ImageBackground>
            </View>
          ) : (
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image" size={64} color="#FF6B35" />
              <Text style={styles.placeholderText}>No media selected</Text>
            </View>
          )}

          {/* Media Selection Buttons */}
          {!mediaUri && (
            <View style={styles.mediaButtonsContainer}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => handlePickMedia("image")}
              >
                <Ionicons name="images" size={24} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => handlePickMedia("video")}
              >
                <Ionicons name="videocam" size={24} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => handleCameraCapture("image")}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Caption Input */}
          <View style={styles.captionSection}>
            <Text style={styles.sectionLabel}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="What's on your mind? #DanceChallenge"
              placeholderTextColor="#718096"
              multiline
              numberOfLines={4}
              value={content}
              onChangeText={setContent}
              maxLength={300}
            />
            <Text style={styles.charCount}>{content.length}/300</Text>
          </View>

          {/* Challenge Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Challenge (Optional)</Text>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => {
                fetchChallenges();
                setShowChallengeModal(true);
              }}
            >
              <View style={styles.selectionButtonContent}>
                <Ionicons name="flame" size={20} color="#FF6B35" />
                <Text style={styles.selectionButtonText}>
                  {selectedChallenge?.title || "Select a challenge"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          </View>

          {/* Song Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Song (Optional)</Text>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => {
                fetchSongs();
                setShowSongModal(true);
              }}
            >
              <View style={styles.selectionButtonContent}>
                <Ionicons name="musical-note" size={20} color="#FF6B35" />
                <Text style={styles.selectionButtonText}>
                  {selectedSong?.title || "Select a song"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          </View>

          {/* Visibility Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Visibility</Text>
            <View style={styles.visibilityContainer}>
              {["public", "private"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.visibilityOption,
                    visibility === option && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setVisibility(option as "public" | "private")}
                >
                  <Ionicons
                    name={option === "public" ? "globe" : "lock-closed"}
                    size={18}
                    color={visibility === option ? "#FFFFFF" : "#888888"}
                  />
                  <Text
                    style={[
                      styles.visibilityText,
                      visibility === option && styles.visibilityTextActive,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Create Post Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              loading && styles.createButtonDisabled,
            ]}
            onPress={handleCreatePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Post to KontriVibe</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Challenge Selection Modal */}
        <Modal visible={showChallengeModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowChallengeModal(false)}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Challenge</Text>
                <View style={{ width: 24 }} />
              </View>

              <FlatList
                data={challenges}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedChallenge(item);
                      setShowChallengeModal(false);
                    }}
                  >
                    <View>
                      <Text style={styles.modalItemTitle}>{item.title}</Text>
                      <Text style={styles.modalItemSubtitle}>
                        {item.description}
                      </Text>
                    </View>
                    {selectedChallenge?._id === item._id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#FF6B35"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Song Selection Modal */}
        <Modal visible={showSongModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowSongModal(false)}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Song</Text>
                <View style={{ width: 24 }} />
              </View>

              <FlatList
                data={songs}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedSong(item);
                      setShowSongModal(false);
                    }}
                  >
                    <View>
                      <Text style={styles.modalItemTitle}>{item.title}</Text>
                      <Text style={styles.modalItemSubtitle}>
                        {item.artist}
                      </Text>
                    </View>
                    {selectedSong?._id === item._id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#FF6B35"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a3a2a",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.5)",
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
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  mediaPreviewContainer: {
    marginBottom: 24,
    overflow: "hidden",
    borderRadius: 16,
  },
  mediaPreview: {
    height: 400,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 12,
  },
  changeMediaBtn: {
    padding: 8,
  },
  mediaPlaceholder: {
    height: 300,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  placeholderText: {
    color: "#888888",
    fontSize: 14,
    marginTop: 12,
  },
  mediaButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mediaButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  captionSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 8,
  },
  captionInput: {
    backgroundColor: "rgba(15, 20, 25, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 14,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: "#888888",
    marginTop: 8,
    textAlign: "right",
  },
  section: {
    marginBottom: 20,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15, 20, 25, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  visibilityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(15, 20, 25, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  visibilityOptionActive: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    borderColor: "#FF6B35",
  },
  visibilityText: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "500",
  },
  visibilityTextActive: {
    color: "#FFFFFF",
  },
  createButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
    marginTop: 12,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A202C",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 107, 53, 0.2)",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 107, 53, 0.1)",
  },
  modalItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  modalItemSubtitle: {
    fontSize: 12,
    color: "#888888",
  },
});
