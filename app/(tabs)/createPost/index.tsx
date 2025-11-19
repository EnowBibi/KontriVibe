/*-----------------------------------------------------------------------------------------------------
 | @screen CreateProjectsScreen
 | @brief    Displays create options and recent projects with consistent UI
 | @param    --
 | @return   React.JSX.Element
 ----------------------------------------------------------------------------------------------------*/

import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Song {
  _id: string;
  title: string;
  artist: string; // or artistId populated
  coverImage?: string;
  audioUrl: string;
}

const CreateProjectsScreen = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserSongs();
  }, []);

  const fetchUserSongs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) return;

      // Assuming an endpoint to get user's uploaded songs
      const response = await fetch(`${BASE_URL}/api/songs/artist/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Music fetch response: ", response);
      if (response.ok) {
        const data = await response.json();
        setRecentSongs(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMusic = () => {
    router.push(ROUTES.UPLOAD_SONG);
    setSelectedOption("upload");
  };

  const handleAILyrics = () => {
    router.push(ROUTES.LYRICS_GENERATOR);
    setSelectedOption("ai");
  };

  const handleMakePost = () => {
    router.push(ROUTES.POST);
    setSelectedOption("post");
  };

  const handlePlaySong = (song: Song) => {
    router.push({
      pathname: ROUTES.PLAY_AUDIO,
      params: {
        songId: song._id,
        title: song.title,
        artist:
          typeof song.artist === "object"
            ? (song.artist as any).name
            : song.artist,
        coverImage: song.coverImage,
        audioUrl: song.audioUrl,
      },
    });
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
          <Text style={styles.headerTitle}>Create</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Create Options */}
          <TouchableOpacity
            style={[
              styles.createButton,
              selectedOption === "upload" && styles.createButtonActive,
            ]}
            onPress={handleUploadMusic}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="musical-note" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.buttonText}>Upload New Song</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              selectedOption === "ai" && styles.createButtonActive,
            ]}
            onPress={handleAILyrics}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="sparkles" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.buttonText}>AI Lyrics Generator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              selectedOption === "post" && styles.createButtonActive,
            ]}
            onPress={handleMakePost}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="image" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.buttonText}>Make Post</Text>
          </TouchableOpacity>

          {/* Recent Projects Section */}
          <View style={styles.recentProjectsContainer}>
            <View style={styles.recentProjectsHeader}>
              <Text style={styles.recentProjectsTitle}>Recent Projects</Text>
              <TouchableOpacity onPress={fetchUserSongs}>
                <Ionicons name="refresh" size={20} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator color="#FF6B35" style={{ marginTop: 20 }} />
            ) : recentSongs.length > 0 ? (
              recentSongs.map((song) => (
                <TouchableOpacity
                  key={song._id}
                  style={styles.projectItem}
                  onPress={() => handlePlaySong(song)}
                >
                  <View style={styles.projectImagePlaceholder}>
                    {song.coverImage ? (
                      <Image
                        source={{ uri: song.coverImage }}
                        style={styles.projectImage}
                      />
                    ) : (
                      <Ionicons name="musical-note" size={24} color="#FF6B35" />
                    )}
                  </View>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>{song.title}</Text>
                    <Text style={styles.projectArtist}>
                      {typeof song.artist === "object"
                        ? (song.artist as any).name
                        : "Unknown Artist"}
                    </Text>
                  </View>
                  <Ionicons name="play-circle" size={32} color="#FF6B35" />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No songs uploaded yet.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default CreateProjectsScreen;

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
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 20, 25, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  createButtonActive: {
    borderColor: "#FF6B35",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  recentProjectsContainer: {
    marginTop: 24,
  },
  recentProjectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentProjectsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  projectImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  projectImage: {
    width: "100%",
    height: "100%",
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  projectArtist: {
    fontSize: 14,
    color: "#888888",
  },
  emptyText: {
    color: "#888888",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
