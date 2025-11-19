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
  artistId:
    | {
        _id: string;
        fullName: string;
        email: string;
      }
    | string;
  coverImage?: string;
  audioUrl: string;
  genre?: string;
  mood?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: string;
  image: string;
}

const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "#MakossaChallenge",
    description: "Show us your best Makossa moves!",
    participants: "1.2k",
    image: "https://i.ytimg.com/vi/3X9wEwulYyU/maxresdefault.jpg",
  },
  {
    id: "2",
    title: "#CoupDuMarteau",
    description: "Can you handle the hammer beat?",
    participants: "5.4k",
    image: "https://i1.sndcdn.com/artworks-000665976001-025600-t500x500.jpg",
  },
  {
    id: "3",
    title: "#AfroVibe",
    description: "Vibe to the latest Afro beats.",
    participants: "3.8k",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3z3&s",
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

      const response = await fetch(`${BASE_URL}/api/songs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Songs API response:", data);

        // Handle different response formats:
        // 1. Direct array: [...]
        // 2. Wrapped in data: { data: [...] }
        // 3. Wrapped in songs: { songs: [...] }
        let songsArray: Song[] = [];

        if (Array.isArray(data)) {
          songsArray = data;
        } else if (data.songs && Array.isArray(data.songs)) {
          songsArray = data.songs;
        } else if (data.data && Array.isArray(data.data)) {
          songsArray = data.data;
        }

        setSongs(songsArray);
        console.log("Songs loaded:", songsArray.length);
      } else {
        console.log("Failed to fetch songs, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengePress = (challenge: Challenge) => {
    console.log("Challenge pressed:", challenge.title);
    router.push(ROUTES.POST);
  };

  const handlePlaySong = (song: Song) => {
    const artistName =
      typeof song.artistId === "object"
        ? song.artistId.fullName
        : "Unknown Artist";

    router.push({
      pathname: ROUTES.PLAY_AUDIO,
      params: {
        songId: song._id,
        title: song.title,
        artist: artistName,
        coverImage: song.coverImage || "",
        audioUrl: song.audioUrl,
      },
    });
  };

  const switchTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    Animated.spring(indicator, {
      toValue: tabIndex * (width / 2),
      useNativeDriver: false,
      stiffness: 150,
      damping: 20,
      mass: 1,
    }).start();
  };

  /** ---------------- SWIPE GESTURE ---------------- **/
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dx) > 20;
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -50 && activeTab === 0) {
        switchTab(1);
      } else if (gesture.dx > 50 && activeTab === 1) {
        switchTab(0);
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
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
                    activeTab === 0 && styles.tabTextActive,
                  ]}
                >
                  Explore Music
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchTab(1)}
                style={styles.tabButton}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 1 && styles.tabTextActive,
                  ]}
                >
                  My Challenges
                </Text>
              </TouchableOpacity>

              <Animated.View style={[styles.indicator, { left: indicator }]} />
            </View>

            {/* ---- TAB CONTENT ---- */}
            {activeTab === 0 ? (
              // EXPLORE MUSIC TAB
              <View style={styles.contentContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Trending Music</Text>
                  <TouchableOpacity onPress={fetchSongs}>
                    <Ionicons name="refresh" size={20} color="#FF6B35" />
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6B35" />
                    <Text style={styles.loadingText}>Loading music...</Text>
                  </View>
                ) : songs.length > 0 ? (
                  songs.map((song) => (
                    <TouchableOpacity
                      key={song._id}
                      style={styles.songItem}
                      onPress={() => handlePlaySong(song)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.songImagePlaceholder}>
                        {song.coverImage ? (
                          <Image
                            source={{ uri: song.coverImage }}
                            style={styles.songImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons
                            name="musical-note"
                            size={28}
                            color="#FF6B35"
                          />
                        )}
                      </View>
                      <View style={styles.songInfo}>
                        <Text style={styles.songName} numberOfLines={1}>
                          {song.title}
                        </Text>
                        <Text style={styles.songArtist} numberOfLines={1}>
                          {typeof song.artistId === "object"
                            ? song.artistId.fullName
                            : "Unknown Artist"}
                        </Text>
                        {song.genre && (
                          <Text style={styles.songGenre}>{song.genre}</Text>
                        )}
                      </View>
                      <View style={styles.playButtonContainer}>
                        <Ionicons
                          name="play-circle"
                          size={40}
                          color="#FF6B35"
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="musical-notes-outline"
                      size={48}
                      color="#888888"
                    />
                    <Text style={styles.emptyText}>No music available yet</Text>
                    <Text style={styles.emptySubtext}>
                      Check back later for trending tracks
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              // MY CHALLENGES TAB
              <View style={styles.contentContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular Challenges</Text>
                  <View style={styles.challengeBadge}>
                    <Text style={styles.challengeBadgeText}>
                      {DUMMY_CHALLENGES.length}
                    </Text>
                  </View>
                </View>

                {DUMMY_CHALLENGES.map((challenge) => (
                  <TouchableOpacity
                    key={challenge.id}
                    style={styles.challengeCard}
                    onPress={() => handleChallengePress(challenge)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={{ uri: challenge.image }}
                      style={styles.challengeImage}
                      imageStyle={{ borderRadius: 16 }}
                    >
                      <View style={styles.challengeOverlay}>
                        <View style={styles.challengeHeader}>
                          <Text style={styles.challengeTitle}>
                            {challenge.title}
                          </Text>
                          <View style={styles.participantsContainer}>
                            <Ionicons name="people" size={14} color="#FF6B35" />
                            <Text style={styles.challengeParticipants}>
                              {challenge.participants}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </ImageBackground>
                    <View style={styles.challengeFooter}>
                      <Text style={styles.challengeDescription}>
                        {challenge.description}
                      </Text>
                      <View style={styles.joinButtonContainer}>
                        <Ionicons
                          name="arrow-forward-circle"
                          size={20}
                          color="#FF6B35"
                        />
                        <Text style={styles.joinButtonText}>
                          Join Challenge
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
    backgroundColor: "rgba(15, 20, 25, 0.6)",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /** ---------------- Tabs ---------------- **/
  tabContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  tabText: {
    color: "#888888",
    fontSize: 15,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    width: width / 2,
    height: 3,
    backgroundColor: "#FF6B35",
    borderRadius: 2,
  },

  /** ---------------- Content ---------------- **/
  contentContainer: {
    width: "100%",
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  challengeBadge: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF6B35",
  },
  challengeBadgeText: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "700",
  },

  /** ---------------- Loading & Empty States ---------------- **/
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#888888",
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#888888",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  /** ---------------- Song Items ---------------- **/
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  songImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  songImage: {
    width: "100%",
    height: "100%",
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
  },
  songName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 2,
  },
  songGenre: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
  },
  playButtonContainer: {
    marginLeft: 8,
  },

  /** ---------------- Challenge Cards ---------------- **/
  challengeCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  challengeImage: {
    height: 180,
    justifyContent: "flex-end",
  },
  challengeOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  challengeParticipants: {
    color: "#FF6B35",
    fontSize: 13,
    fontWeight: "700",
  },
  challengeFooter: {
    padding: 16,
  },
  challengeDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  joinButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  joinButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default Challenges;
