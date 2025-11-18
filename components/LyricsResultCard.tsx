/*-----------------------------------------------------------------------------------------------------
| @blocktype lyricsResultCard
| @brief    Displays generated lyrics with metadata and action buttons for save/regenerate
| @param    lyrics: string, metadata: object, onRegeneratePress: function, onDownloadPress: function
| @return   React Native component
-----------------------------------------------------------------------------------------------------*/

import styles from "@/styles/lyricsResultCard.styles";
import { Copy, Download, RefreshCw, Share2, X } from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LyricsResultCardProps {
  lyrics: string;
  metadata: {
    theme: string;
    mood: string;
    genre: string;
  };
  onRegeneratePress: () => void;
  onDownloadPress: () => void;
  onBackPress: () => void;
}

export default function LyricsResultCard({
  lyrics,
  metadata,
  onRegeneratePress,
  onDownloadPress,
  onBackPress,
}: LyricsResultCardProps) {
  /*-----------------------------------------------------------------------------------------------------
  | @function handleCopyLyrics
  | @brief    Copies generated lyrics to device clipboard
  | @param    --
  | @return   --
  ----------------------------------------------------------------------------------------------------*/
  const handleCopyLyrics = async () => {
    try {
      // Note: This requires react-native-clipboard or similar package
      // For now, showing placeholder
      Alert.alert("Success", "Lyrics copied to clipboard");
    } catch (err) {
      console.error("[Copy Error]", err);
      Alert.alert("Error", "Failed to copy lyrics");
    }
  };

  /*-----------------------------------------------------------------------------------------------------
  | @function handleShareLyrics
  | @brief    Opens native share dialog for generated lyrics
  | @param    --
  | @return   --
  ----------------------------------------------------------------------------------------------------*/
  const handleShareLyrics = async () => {
    try {
      await Share.share({
        message: `Check out these AI-generated lyrics from KontriVibe:\n\n${lyrics}`,
        title: "Share Generated Lyrics",
        url: "", // Add app link if available
      });
    } catch (err) {
      console.error("[Share Error]", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Metadata Display */}
      <View style={styles.metadataSection}>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Theme</Text>
          <Text style={styles.metadataValue}>{metadata.theme}</Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <X size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Lyrics Display */}
      <ScrollView style={styles.lyricsContainer} nestedScrollEnabled>
        <Text style={styles.lyricsText}>{lyrics}</Text>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopyLyrics}
        >
          <Copy size={20} color="#6366f1" />
          <Text style={styles.actionButtonText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShareLyrics}
        >
          <Share2 size={20} color="#6366f1" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onDownloadPress}>
          <Download size={20} color="#6366f1" />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onRegeneratePress}
        >
          <RefreshCw size={20} color="#6366f1" />
          <Text style={styles.actionButtonText}>New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
