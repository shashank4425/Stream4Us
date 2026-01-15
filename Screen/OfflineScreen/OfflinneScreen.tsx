import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
export default function OfflineScreen({ navigation }) {
  const redirected = useRef(false);

  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const hasInternet =
        state.isConnected && state.isInternetReachable;

      if (hasInternet && !redirected.current) {
        redirected.current = true;

        setBackOnline(true); // 
        setTimeout(() => {
          navigation.replace("BottomAppNavigator");
        }, 1200); 
      }
    });

    return () => unsubscribe();
  }, []);

  const openWifiSettings = async () => {
    try {
      if (Platform.OS === "android") {
        await Linking.sendIntent("android.settings.WIFI_SETTINGS");
      } else {
        await Linking.openURL("App-Prefs:root=WIFI");
      }
    } catch (e) {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/stream4us/logo/stream4us_rocket.png")}
          style={styles.rocket}
        />
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>
          Please turn on your mobile data or connect to Wi-Fi to continue
        </Text>
        <Pressable
          onPress={openWifiSettings}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          android_ripple={{ color: "#1A1A1A" }}
        >
          <Text style={styles.buttonText}>Open Device Settings</Text>
        </Pressable>
      </View>
      {backOnline && (
        <View style={styles.backOnline}>
          <Text style={styles.backOnlineText}>Back Online</Text>
        </View>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0E10",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",  // 🔑 SAME padding for everything
  },

  content: {
    width: "100%", // 🔑 forces same left/right edges
    alignItems: "center",
    paddingHorizontal: 60
  },
  rocket: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 0,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    color: "#9A9A9A",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },

  button: {
    width: "100%", // 🔑 aligns with text width
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#16181C",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  backOnline: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 2,
    backgroundColor: "#1DB954", // ✅ green success
    alignItems: "center",
  },

  backOnlineText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
  }
});
