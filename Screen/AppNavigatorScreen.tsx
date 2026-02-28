import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomAppNavigator from "./BottomAppNavigator";
import OfflineScreen from './OfflineScreen/OfflinneScreen';
import SplashScreen from "./SplashScreen";
import MoviePlayer from './VideoPlayer/MoviePlayerScreen';

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;

export default function AppNavigatorScreen() {
  const insets = useSafeAreaInsets();
  const [currentRoute, setCurrentRoute] = useState("SplashScreen");

  // ✅ Proper place to control Navigation Bar
  useEffect(() => {
    if (Platform.OS !== "android") return;

    async function configureNavBar() {
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setButtonStyleAsync("light");

      if (currentRoute === "SplashScreen") {
        await NavigationBar.setBackgroundColorAsync("transparent");
      } else {
        await NavigationBar.setBackgroundColorAsync("#0D0E10");
      }
    }

    configureNavBar();
  }, [currentRoute]);

  return (
    <>
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

            setCurrentRoute(route.name);
          },
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OfflineScreen" component={OfflineScreen}
          options={{ presentation: "card", animation: 'fade', gestureEnabled: false }} />

        <Stack.Screen name="BottomAppNavigator" component={BottomAppNavigator}
          options={{ presentation: "card", animation: 'fade', gestureEnabled: false }} />

        <Stack.Screen name="MoviePlayer" component={MoviePlayer}
          options={{ presentation: "card", animation: 'fade', gestureEnabled: false, headerShown: false, cardStyle: { backgroundColor: "#0D0E10", width: "100%", height: "100%" } }} />
        
      </Stack.Navigator>

      {/* Bottom overlay to match nav bar */}
      {currentRoute !== "SplashScreen" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: insets.bottom,
            backgroundColor: "#000000",
          }}
        />
      )}
    </>
  );
}