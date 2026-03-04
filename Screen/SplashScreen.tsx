import NetInfo from "@react-native-community/netinfo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text
} from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(async () => {
      const state = await NetInfo.fetch();

      if (state.isConnected && state.isInternetReachable) {
        navigation.replace("BottomAppNavigator");
      } else {
        navigation.replace("OfflineScreen");
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#0496FF", "#7B3FE4", "#FF007F"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}   // TOP LEFT
        end={{ x: 1, y: 1 }}     // BOTTOM RIGHT
        style={styles.gradient}
      >
        <Image
          source={require("../assets/images/stream4us/logo/stream4us.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Stream4Us</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  gradient: {
    flex: 1,                 // IMPORTANT: must fill screen
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 222,
    height: 222,
    resizeMode: "contain",
  },

  title: {
    marginTop: -32,
    fontSize: 48,
    fontWeight: "700",
    color: "#ffffff",
    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});