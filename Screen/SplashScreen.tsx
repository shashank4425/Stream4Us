import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet, View } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Allow drawing UNDER the nav bar
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("transparent");
  
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.replace("Home");
    }, 4500);

    return () => clearTimeout(timeout);
  }, []);
 return (
  <View style={styles.container}>
    <Animated.View style={[styles.full, { opacity: fadeAnim }]}>
      <ImageBackground
        source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
        style={{height:screenHeight}}
        resizeMode="cover"
      />
    </Animated.View>
  </View>
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
