import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color="white" />
          ),
        }}
      />

      {/* Explore Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color="white" />
          ),
        }}
      />

      {/* Create Post Tab (Plus Icon) */}
      <Tabs.Screen
        name="createPost"
        options={{
          title: " ",
          tabBarLabel: () => null, // hide label
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size + 8} color="white" />
          ),
        }}
      />

      {/* Discover Tab */}
      <Tabs.Screen
        name="discover"
        options={{
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color="white" />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color="white" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
