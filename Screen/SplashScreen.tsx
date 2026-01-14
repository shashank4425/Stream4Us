import NetInfo from "@react-native-community/netinfo";
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

    const timeout = setTimeout(async () => {
      const state = await NetInfo.fetch();

      if (state.isConnected && state.isInternetReachable) {
        navigation.replace("BottomAppNavigator");
      } else {
        navigation.replace("OfflineScreen");
      }
    }, 4000); // splash duration

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
