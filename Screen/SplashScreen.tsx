import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
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
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require("../assets/images/stream4us/logo/stream4us_splash.png")}
          resizeMode="cover"
          style={[
            styles.image,
            Platform.OS === "android" && {
              marginBottom: -insets.bottom,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
