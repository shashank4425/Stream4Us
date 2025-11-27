import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function SplashScreen({ navigation }) {

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.replace("Home");
    }, 4500); // suggested 3 seconds

    return () => clearTimeout(timeout);
  }, []);

    return (
        <SafeAreaView style={{ flex: 1 }} edges={[]}> 
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ImageBackground
            source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
            style={{
              flex: 1,
              width: "100%",
              height: windowHeight
            }}
          />
        </Animated.View>
      </SafeAreaView>
      );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0E10" },
  bg: {
    flex: 1,
    width: "100%",
    height: windowHeight,
    resizeMode: "cover",
  }
});