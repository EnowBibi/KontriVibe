import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          backgroundColor: "#1a1a1a",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 8,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: " ",
          tabBarIcon: ({ size }) => <Ionicons name="home" size={size} color="white" />,
        }}
      />

      {/* Explore Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: " ",
          tabBarIcon: ({ size }) => <Ionicons name="sparkles-outline" size={size} color="white" />,
        }}
      />

      {/* Create Post Tab (Hexagon with Plus) */}
      <Tabs.Screen
        name="createPost"
        options={{
          title: " ",
          tabBarLabel: () => null,
          tabBarIcon: ({ size }) => (
            <View style={styles.hexWrapper}>
              <Svg width={56} height={48} viewBox="0 0 100 86">
                <Polygon
                  points="50,0 100,25 100,61 50,86 0,61 0,25"
                  fill="#FF6B35"
                />
              </Svg>
              <Ionicons
                name="add"
                size={28}
                color="white"
                style={styles.plusIcon}
              />
            </View>
          ),
        }}
      />

      {/* Discover Tab */}
      <Tabs.Screen
        name="discover"
        options={{
          title: " ",
          tabBarIcon: ({ size }) => <Ionicons name="sparkles-outline" size={size} color="white" />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: " ",
          tabBarIcon: ({ size }) => <Ionicons name="person-outline" size={size} color="white" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  hexWrapper: {
    width: 56,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  plusIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -14,
    marginLeft: -14,
  },
});
