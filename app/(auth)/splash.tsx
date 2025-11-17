import { ROUTES } from "@/constants/navigation";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

/*----------------------------------------------------------------------------------------------------- 
| @screen splash
| @brief    Welcome screen that displays brand logo and transitions to login after 3 seconds
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace(ROUTES.LOGIN);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Brand Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Amplify African Music</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.loaderContainer}>
        <View style={[styles.loader, { backgroundColor: "#FF6B35" }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "#A0AEC0",
    fontStyle: "italic",
  },
  loaderContainer: {
    position: "absolute",
    bottom: 60,
  },
  loader: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.6,
  },
});
