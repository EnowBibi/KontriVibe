import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
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

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        // Handle case where user is not logged in
        setLoading(false);
        return;
      }

      // 1. Fetch User Details
      const userRes = await fetch(`${BASE_URL}/api/auth/user/${userId}`);
      const userData = await userRes.json();
      if (userData.success) {
        setUser(userData.user);
      }

      // 2. Fetch User Posts (Mocking the endpoint if it doesn't exist, or using dummy if empty)
      // Assuming an endpoint exists, otherwise we'll just simulate empty and use dummy
      try {
        const postsRes = await fetch(`${BASE_URL}/api/posts/user/${userId}`);
        const postsData = await postsRes.json();

        if (postsData.success && postsData.posts.length > 0) {
          setPosts(postsData.posts);
        } else {
          // Use dummy posts if no posts found
          setPosts([
            { id: "dummy1", image: require("@/assets/images/lady.png") },
            { id: "dummy2", image: require("@/assets/images/room.png") },
            { id: "dummy3", image: require("@/assets/images/room.png") },
          ]);
        }
      } catch (error) {
        // Fallback to dummy posts on error
        setPosts([
          { id: "dummy1", image: require("@/assets/images/lady.png") },
          { id: "dummy2", image: require("@/assets/images/room.png") },
          { id: "dummy3", image: require("@/assets/images/room.png") },
        ]);
      }

      // 3. Fetch User Songs
      try {
        const songsRes = await fetch(`${BASE_URL}/api/songs/artist/${userId}`);
        const songsData = await songsRes.json();
        if (Array.isArray(songsData)) {
          setSongs(songsData);
        }
      } catch (error) {
        console.log("Error fetching songs:", error);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/img-bg.jpg")}
      style={styles.container}
    >
      {/* Overlay */}
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Cover Image */}
          <View style={styles.coverContainer}>
            <Image
              source={
                user?.coverImage
                  ? { uri: user.coverImage }
                  : require("@/assets/images/img-bg.jpg") // Fallback cover
              }
              style={styles.coverImage}
            />
          </View>

          {/* Profile Picture - Circular */}
          <View style={styles.profilePictureWrapper}>
            <Image
              source={
                user?.profileImage
                  ? { uri: user.profileImage }
                  : require("@/assets/images/img-bg.jpg") // Fallback profile pic
              }
              style={styles.profilePicture}
            />
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.fullName || "User"}</Text>
            <Text style={styles.bio}>
              {user?.role || "🎵 Music Lover | Artist"}
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>
                  {user?.followersCount || "0"}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{user?.likesCount || "0"}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Add friends</Text>
            </TouchableOpacity>
          </View>

          {/* Songs Section */}
          {songs.length > 0 && (
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>My Songs</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.songsScroll}
              >
                {songs.map((song) => (
                  <TouchableOpacity
                    key={song._id}
                    style={styles.songCard}
                    onPress={() =>
                      router.push({
                        pathname: ROUTES.PLAY_AUDIO,
                        params: {
                          uri: song.audioUrl,
                          title: song.title,
                          artist: user?.username,
                          cover: song.coverImage,
                        },
                      })
                    }
                  >
                    <Image
                      source={
                        song.coverImage
                          ? { uri: song.coverImage }
                          : require("@/assets/images/img-bg.jpg")
                      }
                      style={styles.songCover}
                    />
                    <Text style={styles.songTitle} numberOfLines={1}>
                      {song.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Recent Posts Section */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Recent Post</Text>
            <View style={styles.gridContainer}>
              {posts.map((item, index) => (
                <View key={item.id || index} style={styles.gridItem}>
                  <Image
                    source={item.image ? item.image : { uri: item.mediaUrl }}
                    style={styles.gridImage}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a3a2a",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.4)",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverContainer: {
    height: 180,
    backgroundColor: "#333",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profilePictureWrapper: {
    position: "absolute",
    top: 102,
    left: "50%",
    marginLeft: -77.5,
    width: 155,
    height: 155,
    borderRadius: 77.5,
    overflow: "hidden",
    zIndex: 20,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 4,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileInfo: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  name: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  bio: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    width: "100%",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  actionButton: {
    width: 125,
    height: 34,
    backgroundColor: "#00463A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF9E00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  contentSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  gridItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  songsScroll: {
    flexDirection: "row",
  },
  songCard: {
    marginRight: 12,
    width: 100,
  },
  songCover: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  songTitle: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});
