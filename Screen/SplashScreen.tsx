import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet, View } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    <View style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
          style={styles.bg}
        >
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
});