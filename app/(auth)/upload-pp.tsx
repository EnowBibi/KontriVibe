import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/*-----------------------------------------------------------------------------------------------------
 | @screen upload-profile-picture
 | @brief    Profile picture upload screen that appears after successful signup
 | @param    --
 | @return   --
 ----------------------------------------------------------------------------------------------------*/

export default function UploadPP() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = params?.userId as string | undefined;

  /*-----------------------------------------------------------------------------------------------------
   | @function handlePickImage
   | @brief    Opens device image picker to select profile picture
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handlePickImage = async () => {
    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need permission to access your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  /*-----------------------------------------------------------------------------------------------------
   | @function handleUploadProfile
   | @brief    Uploads selected profile picture to backend
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleUploadProfile = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select a profile picture");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User information missing. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const imageExtension = selectedImage.split(".").pop() || "jpg";
      const mimeType = `image/${
        imageExtension === "jpg" ? "jpeg" : imageExtension
      }`;

      formData.append("profileImage", {
        uri: selectedImage,
        type: mimeType,
        name: `profile-picture.${imageExtension}`,
      } as any);

      formData.append("userId", userId);

      console.log("Uploading profile picture for userId:", userId);
      console.log(
        " FormData keys:",
        Array.from((formData as any).entries()).map(([key]: any) => key)
      );

      const response = await fetch(
        `${BASE_URL}/api/auth/upload-profile-picture`,
        {
          method: "POST",
          body: formData,
          headers: {},
        }
      );

      const responseText = await response.text();
      console.log("[v0] Response status:", response.status);
      console.log("[v0] Response body:", responseText);

      if (!response.ok) {
        throw new Error(
          `Upload failed with status ${response.status}: ${responseText}`
        );
      }

      Alert.alert("Success", "Profile picture uploaded successfully!");
      router.replace(ROUTES.HOME);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture";
      Alert.alert("Upload Error", errorMessage);
      console.error("[Profile Upload Error]", error);
    } finally {
      setLoading(false);
    }
  };

  /*-----------------------------------------------------------------------------------------------------
   | @function handleSkip
   | @brief    Skips profile picture upload and navigates to home screen
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleSkip = () => {
    router.replace(ROUTES.HOME);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 250, height: 250 }}
        />
        <Text style={styles.title}>Upload Profile Picture</Text>
        <Text style={styles.subtitle}>
          Add a profile picture to complete your account
        </Text>
      </View>

      <View style={styles.form}>
        {/* Profile Picture Preview */}
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📷</Text>
              <Text style={styles.placeholderLabel}>No image selected</Text>
            </View>
          )}
        </View>

        {/* Select Image Button */}
        <TouchableOpacity
          style={[styles.selectButton, loading && styles.buttonDisabled]}
          onPress={handlePickImage}
          disabled={loading}
        >
          <Text style={styles.selectButtonText}>
            {selectedImage ? "Change Picture" : "Select Picture"}
          </Text>
        </TouchableOpacity>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
            !selectedImage && styles.buttonInactive,
          ]}
          onPress={handleUploadProfile}
          disabled={loading || !selectedImage}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Upload Picture</Text>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.replace(ROUTES.LOGIN)}>
            <Text style={styles.footerLink}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#A0AEC0",
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#FF6B35",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2D3748",
    backgroundColor: "#1A202C",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderLabel: {
    fontSize: 12,
    color: "#718096",
  },
  selectButton: {
    backgroundColor: "#2D3748",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  selectButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonInactive: {
    backgroundColor: "#718096",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  skipButtonText: {
    color: "#A0AEC0",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerLink: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "700",
  },
});
