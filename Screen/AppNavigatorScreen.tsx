import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from "expo-navigation-bar";
import React, { useRef } from "react";
import { Dimensions, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomAppNavigator from "./BottomAppNavigator";
import OfflineScreen from './OfflineScreen/OfflinneScreen';
import SplashScreen from "./SplashScreen";
import MoviePlayer from './VideoPlayer/MoviePlayerScreen';

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function AppNavigatorScreen() {
  const insets = useSafeAreaInsets();
  const currentRoute = useRef("SplashScreen");

  const handleNavBar = async (routeName) => {
    if (Platform.OS !== "android") return;

    await NavigationBar.setButtonStyleAsync("light");

    if (routeName === "SplashScreen") {
      // 🔥 Splash → buttons only
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setBackgroundColorAsync("transparent");
    } else {
      // 🔥 App screens → full bar background
      await NavigationBar.setPositionAsync("relative"); // ✅ KEY
      await NavigationBar.setBehaviorAsync("inset-swipe");
      await NavigationBar.setBackgroundColorAsync("#0D0E10");
    }
  };

  return (
    <>
      {/* Transparent & visible */}
      <StatusBar translucent barStyle="light-content" />

      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "#0D0E10",
            width: windowWidth,
          },
        }}
        screenListeners={{
          state: (e) => {
            const route =
              e.data.state.routes[e.data.state.index];
            handleNavBar(route.name);
          },
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OfflineScreen" component={OfflineScreen}
          options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false
          }} />
        <Stack.Screen name="BottomAppNavigator" component={BottomAppNavigator}
          options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false
          }} />
        
        <Stack.Screen name="MoviePlayer" component={MoviePlayer}
          options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerShown: false, cardStyle: { backgroundColor: "#0D0E10", width: "100%", height: "100%" }

          }} />
      </Stack.Navigator>

      {/* ⛔ DO NOT SHOW THIS ON SPLASH */}
      {/* {currentRoute.current !== "SplashScreen" && (
        <View style={{ height: insets.bottom, backgroundColor: "#0D0E10" }} />
      )} */}
    </>
  );
}