import { nointernetStyles } from "@/assets/commoncss/nointernextcss";
import React from "react";
import { Image, Linking, Modal, Platform, Pressable, Text, View } from "react-native";
export default function NoInternetModal({ visible, onClose }) {
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
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="slide">

      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <View style={nointernetStyles.modalContainer}>
        <View style={nointernetStyles.content}>
          <Image
            source={require("../../assets/images/stream4us/logo/stream4us_rocket.png")}
            style={nointernetStyles.rocket}
          />
          <Text style={nointernetStyles.title}>No Internet Connection</Text>
          <Text style={nointernetStyles.subtitle}>
            Please turn on your mobile data or connect to Wi-Fi to continue
          </Text>
          <Pressable
            onPress={openWifiSettings}
            style={({ pressed }) => [
              nointernetStyles.button,
              pressed && nointernetStyles.buttonPressed,
            ]}
            android_ripple={{ color: "#1A1A1A" }}
          >
            <Text style={nointernetStyles.buttonText}>Open Device Settings</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

