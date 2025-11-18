import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";

/*-----------------------------------------------------------------------------------------------------
 | @component TabsLayout
 | @brief    Renders the bottom tab navigation for the app with home, explore, create, discover, and profile screens
 | @param    --
 | @return   React.JSX.Element
 -----------------------------------------------------------------------------------------------------*/
const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 80,
          backgroundColor: "#1a1a1a",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: "#8B4513",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 12,
        },
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#888888",
      })}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: " ",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Explore Tab */}
      <Tabs.Screen
        name="challenges"
        options={{
          title: " ",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
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
              <Svg width={70} height={60} viewBox="0 0 100 86">
                <Polygon
                  points="50,0 100,25 100,61 50,86 0,61 0,25"
                  fill="#FF6B35"
                />
              </Svg>
              <Ionicons
                name="add"
                size={36}
                color="white"
                style={styles.plusIcon}
              />
            </View>
          ),
        }}
      />

      {/* Challenge Tab */}
      <Tabs.Screen
        name="library"
        options={{
          title: " ",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="my-library-music" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: " ",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  hexWrapper: {
    width: 70,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  plusIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -18,
    marginLeft: -18,
  },
});
