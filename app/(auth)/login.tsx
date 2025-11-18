import BASE_URL from "@/config/api";
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
| @screen login
| @brief    User login screen for existing KontriVibe accounts
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /*----------------------------------------------------------------------------------------------------- 
  | @function handleLogin
  | @brief    Authenticates user with email and password
  | @param    --
  | @return   --
  ----------------------------------------------------------------------------------------------------*/
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      console.log("baseurl:", BASE_URL);
      // TODO: Replace with actual API call to backend
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // TODO: Store token securely using SecureStore or AsyncStorage
      router.replace(ROUTES.TABS);
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
      console.error(error);
      console.log(error);
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue to KontriVibe</Text>
      </View>

      <View style={styles.form}>
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

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
          disabled={loading}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace(ROUTES.SIGNUP)}>
            <Text style={styles.footerLink}>Sign Up</Text>
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
    paddingBottom: 40,
    alignItems: "center",
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 20,
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
    textAlign: "center",
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
  forgotPassword: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 24,
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
