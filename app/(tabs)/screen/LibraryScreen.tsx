import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  downloaded: boolean;
}

interface LibraryScreenProps {
  downloadedTracks?: Track[];
  streamableTracks?: Track[];
  onPlayTrack?: (track: Track) => void;
  onDownloadTrack?: (track: Track) => void;
  loading?: boolean;
}

const LibraryScreen = ({
  downloadedTracks = [],
  streamableTracks = [],
  onPlayTrack,
  onDownloadTrack,
  loading = false,
}: LibraryScreenProps) => {
  const [activeTab, setActiveTab] = useState<"downloads" | "stream">(
    "downloads"
  );

  const indicator = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: "downloads" | "stream") => {
    setActiveTab(tab);
    Animated.spring(indicator, {
      toValue: tab === "downloads" ? 0 : width / 2,
      useNativeDriver: false,
      stiffness: 150,
      damping: 20,
      mass: 1,
    }).start();
  };

  /** ---------------- SWIPE GESTURE ---------------- **/
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -50 && activeTab === "downloads") {
        switchTab("stream");
      } else if (gesture.dx > 50 && activeTab === "stream") {
        switchTab("downloads");
      }
    },
  });

  const tracks =
    activeTab === "downloads" ? downloadedTracks : streamableTracks;

  const totalDuration = tracks.reduce((acc, track) => {
    const [min, sec] = track.duration.split(":").map(Number);
    return acc + min * 60 + sec;
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const renderTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => onPlayTrack?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  const emptyStateMessage =
    activeTab === "downloads"
      ? "No downloaded tracks yet"
      : "No streamable tracks available";

  return (
    <ImageBackground
      source={require("@/assets/images/img-bg.jpg")}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          {...panResponder.panHandlers} // enable swiping
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Library</Text>
            <Text style={styles.headerSubtitle}>Your Music Collection</Text>
          </View>

          {/* Tab Labels */}
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => switchTab("downloads")}>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "downloads" && styles.activeTabLabel,
                ]}
              >
                Downloads
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => switchTab("stream")}>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "stream" && styles.activeTabLabel,
                ]}
              >
                Stream
              </Text>
            </TouchableOpacity>

            {/* Animated Orange Line */}
            <Animated.View style={[styles.indicator, { left: indicator }]} />
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Tracks</Text>
              <Text style={styles.statValue}>{tracks.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>
                {hours}h {minutes}m
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Status</Text>
              <Text style={styles.statValue}>
                {activeTab === "downloads" ? "Offline" : "Online"}
              </Text>
            </View>
          </View>

          {/* Track List */}
          <View style={styles.tracksSection}>
            {loading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator size="large" color="#FF6B35" />
              </View>
            ) : tracks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>
                  {activeTab === "downloads" ? "⬇️" : "☁️"}
                </Text>
                <Text style={styles.emptyStateText}>{emptyStateMessage}</Text>
              </View>
            ) : (
              <FlatList
                data={tracks}
                renderItem={renderTrack}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a3a2a" },
  overlay: { flex: 1, backgroundColor: "rgba(15, 20, 25, 0.4)" },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: "700", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: "#CCCCCC", marginTop: 4 },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    position: "relative",
  },
  tabLabel: { fontSize: 16, color: "#999999", fontWeight: "600" },
  activeTabLabel: { color: "#FF6B35" },

  indicator: {
    position: "absolute",
    bottom: -2,
    width: width / 2,
    height: 3,
    backgroundColor: "#FF6B35",
  },

  statsBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "rgba(15, 20, 25, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
  },
  statItem: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 11, color: "#999999", marginBottom: 4, textTransform: "uppercase" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#FF6B35" },
  statDivider: { width: 1, backgroundColor: "rgba(255, 107, 53, 0.2)", marginHorizontal: 12 },

  tracksSection: { paddingHorizontal: 16 },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 107, 53, 0.05)",
    borderRadius: 12,
  },
  trackInfo: { flex: 1, marginRight: 12 },
  trackTitle: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  trackArtist: { fontSize: 12, color: "#CCCCCC", marginTop: 2 },
  duration: { fontSize: 12, color: "#999999", minWidth: 30, textAlign: "right" },

  centerContent: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },

  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12, opacity: 0.3 },
  emptyStateText: { fontSize: 14, color: "#CCCCCC", textAlign: "center" },
});
