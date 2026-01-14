import React from "react";
import {
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default function OfflineScreen() {

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
         <MaterialIcon name="rocket-launch"  size={120} color="#495057"></MaterialIcon>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0E10",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60, // 🔑 SAME padding for everything
  },

  content: {
    width: "100%", // 🔑 forces same left/right edges
    alignItems: "center",
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
});
