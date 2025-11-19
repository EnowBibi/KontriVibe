import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Song {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
  audioUrl: string;
}

const DUMMY_CHALLENGES = [
  {
    id: "1",
    title: "#MakossaChallenge",
    description: "Show us your best Makossa moves!",
    participants: "1.2k",
    image: "https://i.ytimg.com/vi/3X9wEwulYyU/maxresdefault.jpg", // Placeholder
  },
  {
    id: "2",
    title: "#CoupDuMarteau",
    description: "Can you handle the hammer beat?",
    participants: "5.4k",
    image: "https://i1.sndcdn.com/artworks-000665976001-025600-t500x500.jpg", // Placeholder
  },
  {
    id: "3",
    title: "#AfroVibe",
    description: "Vibe to the latest Afro beats.",
    participants: "3.8k",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3&s", // Placeholder
  },
];

const Challenges = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  // Shared animated value for indicator
  const indicator = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeTab === 0) {
      fetchSongs();
    }
  }, [activeTab]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      // Fetch all songs
      const response = await fetch(`${BASE_URL}/api/songs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSongs(Array.isArray(data) ? data : data.data || []);
      } else {
        console.log("Failed to fetch songs");
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengePress = () => {
    router.push(ROUTES.POST);
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

  const switchTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    Animated.spring(indicator, {
      toValue: tabIndex * (width / 2), // tab 0 = 0, tab 1 = width/2
      useNativeDriver: false,
      stiffness: 150,
      damping: 20,
      mass: 1,
    }).start();
  };

  /** ---------------- SWIPE GESTURE ---------------- **/
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dx) > 20; // detect horizontal movement
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -50 && activeTab === 0) {
        switchTab(1); // swipe left
      } else if (gesture.dx > 50 && activeTab === 1) {
        switchTab(0); // swipe right
      }
    },
  });
  /** ----------------------------------------------- **/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/img-bg.jpg")}
        style={styles.container}
      >
        <View style={styles.overlay}>
          {/* ENABLE SWIPING */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            {...panResponder.panHandlers}
          >
            {/* ---- TABS SECTION ---- */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => switchTab(0)}
                style={styles.tabButton}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 0 && { color: "#fff", fontWeight: "bold" },
                  ]}
                >
                  Explore
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchTab(1)}
                style={styles.tabButton}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 1 && { color: "#fff", fontWeight: "bold" },
                  ]}
                >
                  MyChallenge
                </Text>
              </TouchableOpacity>

              {/* White underline indicator with smooth transition */}
              <Animated.View style={[styles.indicator, { left: indicator }]} />
            </View>

            {/* ---- TAB CONTENT ---- */}
            {activeTab === 0 ? (
              <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>Trending Music</Text>
                {loading ? (
                  <ActivityIndicator
                    color="#FF6B35"
                    style={{ marginTop: 20 }}
                  />
                ) : songs.length > 0 ? (
                  songs.map((song) => (
                    <TouchableOpacity
                      key={song._id}
                      style={styles.songItem}
                      onPress={() => handlePlaySong(song)}
                    >
                      <View style={styles.songImagePlaceholder}>
                        {song.coverImage ? (
                          <Image
                            source={{ uri: song.coverImage }}
                            style={styles.songImage}
                          />
                        ) : (
                          <Ionicons
                            name="musical-note"
                            size={24}
                            color="#FF6B35"
                          />
                        )}
                      </View>
                      <View style={styles.songInfo}>
                        <Text style={styles.songName}>{song.title}</Text>
                        <Text style={styles.songArtist}>
                          {typeof song.artist === "object"
                            ? (song.artist as any).name
                            : "Unknown Artist"}
                        </Text>
                      </View>
                      <Ionicons name="play-circle" size={32} color="#FF6B35" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No music found.</Text>
                )}

                <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
                  Popular Challenges
                </Text>
                {DUMMY_CHALLENGES.map((challenge) => (
                  <TouchableOpacity
                    key={challenge.id}
                    style={styles.challengeCard}
                    onPress={handleChallengePress}
                  >
                    <ImageBackground
                      source={{ uri: challenge.image }}
                      style={styles.challengeImage}
                      imageStyle={{ borderRadius: 12 }}
                    >
                      <View style={styles.challengeOverlay}>
                        <Text style={styles.challengeTitle}>
                          {challenge.title}
                        </Text>
                        <Text style={styles.challengeParticipants}>
                          {challenge.participants} joined
                        </Text>
                      </View>
                    </ImageBackground>
                    <Text style={styles.challengeDescription}>
                      {challenge.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.tabContent}>
                MyChallenge content goes here...
              </Text>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },

  /** ---------------- Tabs ---------------- **/
  tabContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ffffff55",
    position: "relative",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    color: "#ccc",
    fontSize: 16,
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    width: width / 2,
    height: 3,
    backgroundColor: "#fff",
  },
  tabContent: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
  },
  contentContainer: {
    width: "100%",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  songImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  songImage: {
    width: "100%",
    height: "100%",
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: "#888888",
  },
  emptyText: {
    color: "#888888",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  challengeCard: {
    marginBottom: 20,
  },
  challengeImage: {
    height: 150,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  challengeOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  challengeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  challengeParticipants: {
    color: "#FF6B35",
    fontSize: 12,
    marginTop: 2,
  },
  challengeDescription: {
    color: "#ccc",
    fontSize: 14,
  },

  /** ---------------- Buttons ---------------- **/
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonTextOutline: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Challenges;
