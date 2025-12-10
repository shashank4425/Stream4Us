import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, StatusBar, StyleSheet, View } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
     
    // Fade animation
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
    <View style={{flex:1}}>
      <StatusBar hidden/>
      <ImageBackground
        source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
        style={{flex:1}}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex:1, 
    justifyContent: "center",
  },
});
