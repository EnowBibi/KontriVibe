import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Shared animated value for indicator
  const indicator = useRef(new Animated.Value(0)).current;

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
              <Animated.View
                style={[
                  styles.indicator,
                  { left: indicator },
                ]}
              />
            </View>

            {/* ---- TAB CONTENT ---- */}
            {activeTab === 0 ? (
              <Text style={styles.tabContent}>Explore content goes here...</Text>
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
