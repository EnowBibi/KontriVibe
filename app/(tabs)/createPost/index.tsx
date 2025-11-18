/*-----------------------------------------------------------------------------------------------------
 | @screen CreateProjectsScreen
 | @brief    Displays create options for uploading music, generating lyrics, and making posts
 | @param    --
 | @return   React.JSX.Element
 ----------------------------------------------------------------------------------------------------*/

import { ROUTES } from "@/constants/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CreateProjectsScreen = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  /*-------------------------------------------------------------------------------------------------
   | @function handleUploadMusic
   | @brief    Navigates to music upload screen or handles upload logic
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleUploadMusic = () => {
    setSelectedOption("upload");
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handleAILyrics
   | @brief    Navigates to AI lyrics generator screen
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleAILyrics = () => {
    router.replace({
      pathname: ROUTES.LYRICS_GENERATOR,
    });
    setSelectedOption("ai");
  };

  /*-------------------------------------------------------------------------------------------------
   | @function handleMakePost
   | @brief    Navigates to make post/create content screen
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleMakePost = () => {
    Alert.alert("Make Post", "Navigate to post creation screen");
    setSelectedOption("post");
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
          <TouchableOpacity
          // onPress={() => router.push("/(tabs)/createPost/search")}
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Create Options */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Upload Music Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              selectedOption === "upload" && styles.createButtonActive,
            ]}
            onPress={handleUploadMusic}
            activeOpacity={0.8}
          >
            <Ionicons name="musical-note" size={40} color="#FFFFFF" />
            <Text style={styles.buttonText}>Upload New Song</Text>
          </TouchableOpacity>

          {/* AI Lyrics Generator Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              selectedOption === "ai" && styles.createButtonActive,
            ]}
            onPress={handleAILyrics}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={40} color="#FFFFFF" />
            <Text style={styles.buttonText}>AI Lyrics Generator</Text>
          </TouchableOpacity>

          {/* Make Post Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              selectedOption === "post" && styles.createButtonActive,
            ]}
            onPress={handleMakePost}
            activeOpacity={0.8}
          >
            <Ionicons name="image" size={40} color="#FFFFFF" />
            <Text style={styles.buttonText}>Make Post</Text>
          </TouchableOpacity>

          {/* Recent Projects Section */}
          <View style={styles.recentProjectsContainer}>
            <View style={styles.recentProjectsHeader}>
              <Text style={styles.recentProjectsTitle}>Recent Projects</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Project Items */}
            {[
              { name: "Grainy days", artist: "Breezy" },
              { name: "Coffee", artist: "Lofi Beats" },
              { name: "Raindrops", artist: "Ambient" },
              { name: "Coffee", artist: "Jazz" },
              { name: "Grainy days", artist: "Soul" },
            ].map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectImagePlaceholder}>
                  <Ionicons name="musical-note" size={32} color="#FF6B35" />
                </View>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectArtist}>{project.artist}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#888888"
                  />
                </TouchableOpacity>
              </View>
            ))}
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
    backgroundColor: "#1a3a2a",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 20, 25, 0.4)",
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
  /* Added transparent buttons with orange glowing shadow */
  createButton: {
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 16,
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "rgba(15, 20, 25, 0.3)",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  createButtonActive: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  recentProjectsContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  recentProjectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentProjectsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "500",
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 107, 53, 0.2)",
  },
  projectImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  projectArtist: {
    fontSize: 12,
    color: "#888888",
  },
});
