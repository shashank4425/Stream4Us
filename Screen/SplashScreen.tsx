import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  NavigationBar.setVisibilityAsync("hidden");
  NavigationBar.setBackgroundColorAsync("transparent");

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1500,
    useNativeDriver: true,
  }).start();

  const timeout = setTimeout(async () => {
    await NavigationBar.setVisibilityAsync("visible");
    await NavigationBar.setBackgroundColorAsync("#0D0E10");

    navigation.replace("Home");
  }, 7000);

  return () => {
    NavigationBar.setVisibilityAsync("visible");
    NavigationBar.setBackgroundColorAsync("#0D0E10");
    clearTimeout(timeout);
  };
}, []);


  return (
    
      <Animated.View style={[styles.full, {opacity: fadeAnim }]}>
        <ImageBackground
          source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
          style={StyleSheet.absoluteFillObject}   // 100% fullscreen
          resizeMode="cover"
        />
      </Animated.View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0E10",
  },
  full: {
    ...StyleSheet.absoluteFillObject,
  },
});
