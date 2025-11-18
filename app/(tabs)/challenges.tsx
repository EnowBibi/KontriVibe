import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const indicator = new Animated.Value(activeTab === 0 ? 0 : width / 2);

  const switchTab = (tabIndex: React.SetStateAction<number>) => {
    setActiveTab(tabIndex);

    Animated.timing(indicator, {
      toValue: tabIndex === 0 ? 0 : width / 2,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/img-bg.jpg")}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
        
         

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

              {/* White underline indicator */}
              <Animated.View
                style={[
                  styles.indicator,
                  {
                    left: indicator,
                  },
                ]}
              />
            </View>

            {/* ---- TAB CONTENT ---- */}
            {activeTab === 0 ? (
              <Text style={styles.tabContent}>Explore content goes here...</Text>
            ) : (
              <Text style={styles.tabContent}>MyChallenge content goes here...</Text>
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
  coverImageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 60,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profileImageContainer: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 60,
    overflow: "hidden",
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 70,
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

export default ProfileScreen;
