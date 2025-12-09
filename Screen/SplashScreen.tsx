import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // TRANSPARENT NAVIGATION BAR
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBackgroundColorAsync("transparent");
    NavigationBar.setBehaviorAsync("overlay-swipe");

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      NavigationBar.setVisibilityAsync("visible");
      navigation.replace("Home");
    }, 45000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.full, { opacity: fadeAnim }]}>
    <ImageBackground
      source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
      style={styles.bg}
      resizeMode="cover"
    />
  </Animated.View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,                       // <-- REQUIRED
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  bg: {
    flex: 1,                       // <-- REQUIRED
    width: "100%",
    height: "100%",
  },
});

