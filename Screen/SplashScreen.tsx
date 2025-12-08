import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const setUpBar = async () => {
     await NavigationBar.setBehaviorAsync("inset-touch");
     await NavigationBar.setVisibilityAsync("hidden");
     await NavigationBar.setBackgroundColorAsync("#db125fff");
     await NavigationBar.setButtonStyleAsync("light");
    }
     setUpBar();
   
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1500,
    useNativeDriver: true,
  }).start();

  const timeout = setTimeout(async () => {
      await NavigationBar.setVisibilityAsync("visible");
        navigation.replace("Home");
  }, 4500);

  return () => {
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
