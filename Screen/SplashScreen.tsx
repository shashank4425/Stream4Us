import NetInfo from "@react-native-community/netinfo";
import * as Font from "expo-font";
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
  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    });
  };
  useEffect(() => {
    // Fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    fetchJSON();
  }, []);

  const fetchJSON = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        navigation.replace("OfflineScreen");
        return;
      }

      const response = await fetch(
        "https://raw.githubusercontent.com/shashank4425/Stream4Us/refs/heads/movies/common.json"
      );

      const jsonData = await response.json();
      await loadFonts();
      navigation.replace("BottomAppNavigator", {
        jsonResponse: jsonData,
      });

    } catch (error) {
      console.log("Error fetching JSON:", error);
      navigation.replace("OfflineScreen");
    }
  };

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#00A6FB", "#7B3FE4", "#FF007F"]}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0.1 }}   // TOP LEFT
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
    marginTop: -44,
    fontSize: 50,
    fontFamily: "Poppins-SemiBold",
    color: "#ffffff",
    //textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});