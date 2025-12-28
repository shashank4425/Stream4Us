import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set nav bar black
    // Fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(async () => {

      // // FIX: reset system UI before applying black navbar
      // await NavigationBar.setVisibilityAsync("visible");
      // await NavigationBar.setBehaviorAsync("inset-swipe");
      // await NavigationBar.setBackgroundColorAsync("#0D0E10");
      // await NavigationBar.setButtonStyleAsync("light");

      navigation.replace("Home");
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <ImageBackground
        source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    justifyContent: "center",
  },
});
