import { nointernetStyles } from "@/assets/commoncss/nointernextcss";
import NetInfo from "@react-native-community/netinfo";
import { CommonActions } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OfflineScreen({ navigation, route }) {
  const redirected = useRef(false);
  const insets = useSafeAreaInsets();
  const [backOnline, setBackOnline] = useState(false);

  const redirectTo = route?.params?.redirectTo || "Home";

  const redirect = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomAppNavigator",
            state: {
              index: redirectTo === "LiveStreaming" ? 1 : 0,
              routes: [
                { name: "Home" },
                { name: "LiveStreaming" },
              ],
            },
          },
        ],
      })
    );
  };


  // ✅ IMPORTANT FIX
  const isOnline = (state) =>
    state.isConnected && state.isInternetReachable !== false;

  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      const state = await NetInfo.fetch();

      // ✅ If internet is already ON → leave immediately
      if (isOnline(state)) {
        redirect();
        return;
      }

      // ❌ Offline → wait for reconnect
      unsubscribe = NetInfo.addEventListener((state) => {
        if (isOnline(state) && !redirected.current) {
          redirected.current = true;
          setBackOnline(true);

          setTimeout(redirect, 1000);
        }
      });
    };

    init();
    return () => unsubscribe && unsubscribe();
  }, []);

  const openWifiSettings = async () => {
    try {
      if (Platform.OS === "android") {
        await Linking.sendIntent("android.settings.WIFI_SETTINGS");
      } else {
        await Linking.openURL("App-Prefs:root=WIFI");
      }
    } catch {
      Linking.openSettings();
    }
  };

  return (
    <View style={nointernetStyles.container}>
      <View style={nointernetStyles.content}>
        <Image
          source={require("../../assets/images/stream4us/logo/stream4us_rocket.png")}
          style={nointernetStyles.rocket}
        />

        <Text style={nointernetStyles.title}>
          No Internet Connection
        </Text>

        <Text style={nointernetStyles.subtitle}>
          Please turn on your mobile data or connect to Wi-Fi to continue
        </Text>

        <Pressable
          onPress={openWifiSettings}
          style={({ pressed }) => [
            nointernetStyles.button,
            pressed && nointernetStyles.buttonPressed,
          ]}
        >
          <Text style={nointernetStyles.buttonText}>
            Open Device Settings
          </Text>
        </Pressable>
      </View>

      {backOnline && (
        <View
          style={[
            nointernetStyles.backOnline,
            { marginBottom: insets.bottom },
          ]}
        >
          <Text style={nointernetStyles.backOnlineText}>
            Back Online
          </Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  
});