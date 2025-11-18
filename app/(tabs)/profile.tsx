import React from "react";
import { StyleSheet, View, Text, Image, ImageBackground, ScrollView, TouchableOpacity } from "react-native";


const ProfileScreen = () => {
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
              // source={require("@/assets/images/cover-placeholder.jpg")}
              style={styles.coverImage}
            />
          </View>

          {/* Profile Picture - Circular */}
          <View style={styles.profilePictureWrapper}>
            <Image
              source={require("@/assets/images/img-bg.jpg")}
              style={styles.profilePicture}
            />
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.bio}>🎵 Music Producer | Artist</Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>342</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>856</Text>
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

          {/* Additional Content - Image Grid */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Recent Post</Text>
            <View style={styles.gridContainer}>
              {[
                { id: 1, image: require("@/assets/images/lady.png") },
                { id: 2, image: require("@/assets/images/room.png") },
                { id: 3, image: require("@/assets/images/room1.png") },
                { id: 4, image: require("@/assets/images/lady.png") },
                { id: 5, image: require("@/assets/images/room.png") },
                { id: 6, image: require("@/assets/images/room1.png") },
              ].map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <Image source={item.image} style={styles.gridImage} />
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
  profileCard: {
    marginTop: -70,
    marginHorizontal: 16,
    backgroundColor: "rgba(15,20,25,0.95)",
    borderRadius: 28,
    paddingTop: 90,
    paddingHorizontal: 16,
    paddingBottom: 24,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
    alignItems: "center",
    overflow: "visible",
  },
  profileCardInner: {
    width: "100%",
    alignItems: "center",
  },
  profileInfo: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 16,
    fontWeight : "100",
    color: "white",
    fontSize: 34
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
  tipWrapper: {
    position: "absolute",
    top: -20,
    left: "50%",
    marginLeft: -25,
    width: 50,
    height: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  tipCircle: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(15,20,25,0.85)",
    borderRadius: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  bio: {
    fontSize: 14,
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
  postItem: {
    backgroundColor: "rgba(255,107,53,0.1)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  postText: {
    color: "#FFFFFF",
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
});
