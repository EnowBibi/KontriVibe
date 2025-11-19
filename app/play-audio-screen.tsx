/*-----------------------------------------------------------------------------------------------------
 | @screen PlayAudioScreen
 | @brief    Audio player screen using expo-video for playback
 | @param    params: { title, artist, coverImage, audioUrl }
 | @return   React.JSX.Element
 ----------------------------------------------------------------------------------------------------*/

import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PlayAudioScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, artist, coverImage, audioUrl } = params;

  const player = useVideoPlayer(audioUrl as string, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <ImageBackground
      source={require("@/assets/images/img-bg.jpg")}
      style={styles.container}
      blurRadius={20}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View style={styles.artworkContainer}>
          <View style={styles.artworkWrapper}>
            {coverImage ? (
              <Image
                source={{ uri: coverImage as string }}
                style={styles.artwork}
              />
            ) : (
              <View style={styles.placeholderArtwork}>
                <Ionicons name="musical-notes" size={80} color="#FF6B35" />
              </View>
            )}
          </View>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{title || "Unknown Title"}</Text>
          <Text style={styles.trackArtist}>{artist || "Unknown Artist"}</Text>
        </View>

        {/* Hidden Video Player (for audio playback) */}
        <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
            <VideoView player={player} style={{ width: 100, height: 100 }} />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity>
            <Ionicons name="shuffle" size={24} color="#888888" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => player.seekBy(-10)}>
            <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => player.seekBy(10)}>
            <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="repeat" size={24} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PlayAudioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.7)",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  artworkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  artworkWrapper: {
    width: 300,
    height: 300,
    borderRadius: 24,
    elevation: 20,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    backgroundColor: "#1A202C",
    overflow: "hidden",
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  placeholderArtwork: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  trackInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  trackTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  trackArtist: {
    color: "#888888",
    fontSize: 18,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
