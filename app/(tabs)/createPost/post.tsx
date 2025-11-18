/*-----------------------------------------------------------------------------------------------------
 | @screen PostScreen
 | @brief    TikTok-inspired post creation screen for KontriVibe with vertical media focus, smooth animations, and challenge/song linking
 | @param    --
 | @return   React.JSX.Element
 ----------------------------------------------------------------------------------------------------*/

import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
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

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /*-------------------------------------------------------------------------------------------------
   | @function handlePickMedia
   | @brief    Opens image/video picker with 9:16 aspect ratio (TikTok format) and stores selected media URI
   | @param    mediaType - 'image' or 'video'
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handlePickMedia = async (type: "image" | "video") => {
    try {
      console.log("[v0] Starting media pick - type:", type);

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

      console.log("[v0] ImagePicker result:", {
        canceled: result.canceled,
        assetsLength: result.assets?.length,
        firstAssetUri: result.assets?.[0]?.uri,
        firstAssetType: result.assets?.[0]?.type,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        console.log("[v0] Selected URI:", selectedUri);
        console.log(
          "[v0] URI exists:",
          selectedUri !== null && selectedUri !== undefined
        );

        setMediaUri(selectedUri);
        setMediaType(type);

        console.log("[v0] State updated - mediaUri set to:", selectedUri);
        console.log("[v0] State updated - mediaType set to:", type);
      } else {
        console.log("[v0] ImagePicker cancelled or no assets returned");
      }
    } catch (error) {
      console.error("[v0] Media pick error - Details:", {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : "No stack",
        errorType:
          error instanceof Error ? error.constructor.name : typeof error,
      });
      Alert.alert(
        "Error",
        `Failed to pick media: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handleCameraCapture
   | @brief    Launches camera to capture photo or video in vertical format
   | @param    mediaType - 'image' or 'video'
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleCameraCapture = async (type: "image" | "video") => {
    try {
      console.log("[v0] Starting camera capture - type:", type);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes:
          type === "image"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      console.log("[v0] Camera result:", {
        canceled: result.canceled,
        assetsLength: result.assets?.length,
        firstAssetUri: result.assets?.[0]?.uri,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedUri = result.assets[0].uri;
        console.log("[v0] Captured URI:", capturedUri);

        setMediaUri(capturedUri);
        setMediaType(type);

        console.log("[v0] State updated - mediaUri set to:", capturedUri);
      } else {
        console.log("[v0] Camera capture cancelled");
      }
    } catch (error) {
      console.error("[v0] Camera error - Details:", {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : "No stack",
      });
      Alert.alert(
        "Error",
        `Failed to capture media: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
      formData.append("aiGenerated", 'false');

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
          {mediaUri ? (
            <View style={styles.mediaPreviewContainer}>
              
              <Image
                source={{ uri: mediaUri }}
                style={styles.mediaPreview}
                resizeMode="cover"
                onLoad={() => console.log("[v0] Image loaded successfully")}
                onError={(error) => {
                  console.error("[v0] Image load error:", error);
                  Alert.alert(
                    "Error",
                    "Failed to load image. Please try again."
                  );
                }}
              />
              <TouchableOpacity
                style={styles.changeMediaBtn}
                onPress={() => {
                  console.log("[v0] Clearing media - URI:", mediaUri);
                  setMediaUri(null);
                  setMediaType(null);
                  console.log("[v0] Media cleared");
                }}
              >
                <View style={styles.changeBtnInner}>
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text style={styles.changeBtnText}>Change</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mediaPlaceholder}>
          
              <Ionicons name="videocam" size={56} color="#FF6B35" />
              <Text style={styles.placeholderText}>
                Add your video or photo
              </Text>
              <Text style={styles.placeholderSubtext}>
                Vertical format (9:16) works best
              </Text>
            </View>
          )}

          {!mediaUri && (
            <View style={styles.mediaButtonsContainer}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => handlePickMedia("image")}
              >
                <View style={styles.iconWrapper}>
                  <Ionicons name="images" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.mediaButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => handlePickMedia("video")}
              >
                <View style={styles.iconWrapper}>
                  <Ionicons name="videocam" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => handleCameraCapture("image")}
              >
                <View style={styles.iconWrapper}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.mediaButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.captionSection}>
            <View style={styles.captionHeader}>
              <Text style={styles.sectionLabel}>What's your story?</Text>
              <Text style={[styles.charCount, { marginBottom: 0 }]}>
                {content.length}/300
              </Text>
            </View>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption... #DanceChallenge #KontriVibe"
              placeholderTextColor="#718096"
              multiline
              numberOfLines={4}
              value={content}
              onChangeText={setContent}
              maxLength={300}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flame" size={18} color="#FF6B35" />
              <Text style={styles.sectionLabel}>Add Challenge</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                selectedChallenge && styles.selectionButtonActive,
              ]}
              onPress={() => {
                fetchChallenges();
                setShowChallengeModal(true);
              }}
            >
              <View style={styles.selectionButtonContent}>
                <View
                  style={[
                    styles.selectionBadge,
                    selectedChallenge && styles.selectionBadgeActive,
                  ]}
                >
                  <Ionicons
                    name={selectedChallenge ? "checkmark" : "add"}
                    size={16}
                    color={selectedChallenge ? "#FF6B35" : "#888888"}
                  />
                </View>
                <View>
                  <Text style={styles.selectionLabel}>
                    {selectedChallenge?.title || "No challenge selected"}
                  </Text>
                  {selectedChallenge && (
                    <Text style={styles.selectionSubtext}>
                      {selectedChallenge.description}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="musical-note" size={18} color="#FF6B35" />
              <Text style={styles.sectionLabel}>Add Song</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                selectedSong && styles.selectionButtonActive,
              ]}
              onPress={() => {
                fetchSongs();
                setShowSongModal(true);
              }}
            >
              <View style={styles.selectionButtonContent}>
                <View
                  style={[
                    styles.selectionBadge,
                    selectedSong && styles.selectionBadgeActive,
                  ]}
                >
                  <Ionicons
                    name={selectedSong ? "checkmark" : "add"}
                    size={16}
                    color={selectedSong ? "#FF6B35" : "#888888"}
                  />
                </View>
                <View>
                  <Text style={styles.selectionLabel}>
                    {selectedSong?.title || "No song selected"}
                  </Text>
                  {selectedSong && (
                    <Text style={styles.selectionSubtext}>
                      by {selectedSong.artist}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name={visibility === "public" ? "globe" : "lock-closed"}
                size={18}
                color="#FF6B35"
              />
              <Text style={styles.sectionLabel}>Post Visibility</Text>
            </View>
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
                    color={visibility === option ? "#FF6B35" : "#888888"}
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
                <Ionicons name="arrow-up-circle" size={24} color="#FFFFFF" />
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
                <Text style={styles.modalTitle}>Trending Challenges</Text>
                <View style={{ width: 24 }} />
              </View>

              <FlatList
                data={challenges}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedChallenge?._id === item._id &&
                        styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setSelectedChallenge(item);
                      setShowChallengeModal(false);
                    }}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={styles.modalItemTitle}>{item.title}</Text>
                      <Text style={styles.modalItemSubtitle} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    {selectedChallenge?._id === item._id && (
                      <View style={styles.checkmarkBadge}>
                        <Ionicons name="checkmark" size={18} color="#FF6B35" />
                      </View>
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
                <Text style={styles.modalTitle}>Select a Song</Text>
                <View style={{ width: 24 }} />
              </View>

              <FlatList
                data={songs}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedSong?._id === item._id && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setSelectedSong(item);
                      setShowSongModal(false);
                    }}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={styles.modalItemTitle}>{item.title}</Text>
                      <Text style={styles.modalItemSubtitle}>
                        {item.artist}
                      </Text>
                    </View>
                    {selectedSong?._id === item._id && (
                      <View style={styles.checkmarkBadge}>
                        <Ionicons name="checkmark" size={18} color="#FF6B35" />
                      </View>
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
    backgroundColor: "#0F1419",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.6)",
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  /* TikTok-style vertical media preview with full height */
  mediaPreviewContainer: {
    marginBottom: 24,
    overflow: "hidden",
    borderRadius: 16,
    position: "relative",
  },
  mediaPreview: {
    height: 500,
    width: "100%",
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    borderRadius: 16,
  },
  changeMediaBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
  },
  changeBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  mediaPlaceholder: {
    height: 400,
    backgroundColor: "rgba(255, 107, 53, 0.08)",
    borderWidth: 2,
    borderColor: "rgba(255, 107, 53, 0.4)",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  placeholderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  placeholderSubtext: {
    color: "#888888",
    fontSize: 12,
  },
  mediaButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: "rgba(255, 107, 53, 0.12)",
    borderWidth: 1.5,
    borderColor: "#FF6B35",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  captionSection: {
    marginBottom: 28,
  },
  captionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
  },
  charCount: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 8,
  },
  captionInput: {
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.25)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 14,
    minHeight: 100,
    fontWeight: "500",
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
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectionButtonActive: {
    borderColor: "#FF6B35",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  selectionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  selectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  selectionBadgeActive: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    borderColor: "#FF6B35",
  },
  selectionLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  selectionSubtext: {
    color: "#888888",
    fontSize: 12,
    marginTop: 2,
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
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
    borderRadius: 14,
    paddingVertical: 12,
  },
  visibilityOptionActive: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    borderColor: "#FF6B35",
  },
  visibilityText: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
  },
  visibilityTextActive: {
    color: "#FFFFFF",
  },
  createButton: {
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
    marginTop: 16,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A202C",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 107, 53, 0.15)",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 107, 53, 0.1)",
  },
  modalItemActive: {
    backgroundColor: "rgba(255, 107, 53, 0.08)",
  },
  modalItemContent: {
    flex: 1,
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
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
