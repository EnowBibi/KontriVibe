import { ROUTES } from "@/constants/navigation";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/*----------------------------------------------------------------------------------------------------- 
| @screen signup
| @brief    User registration screen for creating new KontriVibe accounts
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [stageName, setStageName] = useState("");

  /*----------------------------------------------------------------------------------------------------- 
  | @function handleSignUp
  | @brief    Validates form inputs and creates new user account
  | @param    --
  | @return   --
  ----------------------------------------------------------------------------------------------------*/
  const handleSignUp = async () => {
    // Validate inputs
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (isArtist && !stageName.trim()) {
      Alert.alert("Error", "Please enter your stage name");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call to backend
      const response = await fetch("YOUR_API_URL/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role: isArtist ? "artist" : "user",
          stageName: isArtist ? stageName : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      Alert.alert("Success", "Account created! Please log in.");
      router.replace(ROUTES.LOGIN);
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 300, height: 300 }}
        />
        <Text style={styles.subtitle}>Start your music journey today</Text>
      </View>

      <View style={styles.form}>
        {/* Full Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#718096"
            value={fullName}
            onChangeText={setFullName}
            editable={!loading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#718096"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        {/* Artist Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isArtist && styles.toggleButtonActive]}
            onPress={() => setIsArtist(!isArtist)}
            disabled={loading}
          >
            <Text
              style={[styles.toggleText, isArtist && styles.toggleTextActive]}
            >
              {isArtist ? "✓" : ""} I'm an Artist
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stage Name (conditional) */}
        {isArtist && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stage Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your artist name"
              placeholderTextColor="#718096"
              value={stageName}
              onChangeText={setStageName}
              editable={!loading}
            />
          </View>
        )}

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#718096"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#718096"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace(ROUTES.LOGIN)}>
            <Text style={styles.footerLink}>Log In</Text>
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
    paddingTop: 2,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#A0AEC0",
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2D3748",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#1A202C",
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleButton: {
    borderWidth: 2,
    borderColor: "#2D3748",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1A202C",
  },
  toggleButtonActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  toggleText: {
    color: "#A0AEC0",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#A0AEC0",
    fontSize: 14,
  },
  footerLink: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "700",
  },
});
