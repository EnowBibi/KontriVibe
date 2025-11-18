import BASE_URL from "@/config/api";
import { ROUTES } from "@/constants/navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
 | @screen verify-code
 | @brief    Email verification screen for confirming user accounts via verification code
 | @param    --
 | @return   --
 ----------------------------------------------------------------------------------------------------*/

export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const codeInputRef = useRef<TextInput>(null);

  const userId = params?.userId as string | undefined;

  /*-----------------------------------------------------------------------------------------------------
   | @function handleVerifyCode
   | @brief    Validates verification code and submits to backend for account verification
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleVerifyCode = async () => {
    // Validate code input
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    if (code.length !== 6) {
      Alert.alert("Error", "Verification code must be 6 digits");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User information missing. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      Alert.alert("Success", "Email verified successfully!");
      // Navigate to upload profile picture or home screen
      router.replace(ROUTES.HOME);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify code";
      Alert.alert("Verification Error", errorMessage);
      console.error("[Verify Code Error]", error);
    } finally {
      setLoading(false);
    }
  };

  /*-----------------------------------------------------------------------------------------------------
   | @function handleResendCode
   | @brief    Triggers resend of verification code to user email
   | @param    --
   | @return   --
   ----------------------------------------------------------------------------------------------------*/
  const handleResendCode = async () => {
    if (!userId) {
      Alert.alert("Error", "User information missing");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend code");
      }

      Alert.alert("Success", "Verification code sent to your email");
      setCode(""); // Clear input field
      codeInputRef.current?.focus();
    } catch (error) {
      Alert.alert("Error", "Failed to resend verification code");
      console.error("[Resend Code Error]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your email address
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        {/* Verification Code Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            ref={codeInputRef}
            style={styles.codeInput}
            placeholder="000000"
            placeholderTextColor="#718096"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            editable={!loading}
            textAlign="center"
          />
          <Text style={styles.inputHint}>
            Enter the 6-digit code from your email
          </Text>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify Email</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={loading}>
            <Text
              style={[styles.resendLink, loading && styles.resendLinkDisabled]}
            >
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>

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
    paddingTop: 40,
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
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 12,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: "#2D3748",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    backgroundColor: "#1A202C",
    letterSpacing: 8,
  },
  inputHint: {
    fontSize: 12,
    color: "#718096",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 16,
  },
  resendText: {
    color: "#A0AEC0",
    fontSize: 14,
  },
  resendLink: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "700",
  },
  resendLinkDisabled: {
    opacity: 0.6,
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
