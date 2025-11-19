import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const BOTTOM_TAB_HEIGHT = 50; // Adjust based on your actual tab bar height
const SCREEN_HEIGHT = height - BOTTOM_TAB_HEIGHT;

// Dummy Data
const FYP_DATA = [
  {
    id: "1",
    username: "cameroon_vibes",
    description: "Vibing to the new Libianca song! 🇨🇲🔥 #People #Cameroon",
    music: "Libianca - People",
    likes: "1.2M",
    comments: "10K",
    shares: "5K",
    type: "video",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Placeholder
    avatar: "https://i.pravatar.cc/150?u=cameroon_vibes",
  },
  {
    id: "2",
    username: "douala_dance",
    description: "Makossa challenge going viral! 💃🕺 #Makossa #Douala",
    music: "Petit Pays - Ca c'est quoi",
    likes: "850K",
    comments: "5K",
    shares: "2K",
    type: "video",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Placeholder
    avatar: "https://i.pravatar.cc/150?u=douala_dance",
  },
];

const CHALLENGES_DATA = [
  {
    id: "3",
    username: "challenge_king",
    description: "Can you do the #CoupDuMarteau challenge? 🔨",
    music: "Tam Sir - Coup du Marteau",
    likes: "2.5M",
    comments: "20K",
    shares: "15K",
    type: "video",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Placeholder
    avatar: "https://i.pravatar.cc/150?u=challenge_king",
  },
  {
    id: "4",
    username: "afro_moves",
    description: "Best moves for the #AfroDance challenge! 🌍",
    music: "Davido - Unavailable",
    likes: "1.8M",
    comments: "12K",
    shares: "8K",
    type: "video",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Placeholder
    avatar: "https://i.pravatar.cc/150?u=afro_moves",
  },
];

const VideoItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={togglePlay}
        style={styles.videoWrapper}
      >
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
        {!isPlaying && (
          <View style={styles.playIconOverlay}>
            <Ionicons name="play" size={60} color="rgba(255, 255, 255, 0.6)" />
          </View>
        )}
      </TouchableOpacity>

      {/* Right Side Actions */}
      <View style={styles.rightContainer}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.plusIcon}>
            <Ionicons name="add" size={12} color="white" />
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart" size={35} color="white" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-ellipses" size={35} color="white" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="share" size={30} color="white" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomContainer}>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.musicContainer}>
          <Ionicons name="musical-notes" size={15} color="white" />
          <Text style={styles.musicText}>{item.music}</Text>
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"fyp" | "challenges">("fyp");
  const [activePostId, setActivePostId] = useState(
    activeTab === "fyp" ? FYP_DATA[0].id : CHALLENGES_DATA[0].id
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    },
    []
  );

  const data = activeTab === "fyp" ? FYP_DATA : CHALLENGES_DATA;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Tabs */}
      <SafeAreaView style={styles.topTabsContainer}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity onPress={() => setActiveTab("challenges")}>
            <Text
              style={[
                styles.tabText,
                activeTab === "challenges" && styles.activeTabText,
              ]}
            >
              Challenges
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => setActiveTab("fyp")}>
            <Text
              style={[
                styles.tabText,
                activeTab === "fyp" && styles.activeTabText,
              ]}
            >
              FYP
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <VideoItem item={item} isActive={item.id === activePostId} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  flatList: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  videoContainer: {
    width: width,
    height: SCREEN_HEIGHT,
    position: "relative",
  },
  videoWrapper: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  topTabsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 10,
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    borderBottomWidth: 2,
    borderBottomColor: "white",
    paddingBottom: 3,
  },
  separator: {
    width: 1,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
  },
  rightContainer: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
    zIndex: 20,
  },
  profileContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "white",
  },
  plusIcon: {
    position: "absolute",
    bottom: -5,
    backgroundColor: "#EA4359",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 15,
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "600",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 80, // Leave space for right actions
    zIndex: 20,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },
  musicContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  musicText: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
  },
});
