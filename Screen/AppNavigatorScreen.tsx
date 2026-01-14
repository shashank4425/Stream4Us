import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from "expo-navigation-bar";
import { usePathname } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomAppNavigator from "./BottomAppNavigator";
import OfflineScreen from './OfflineScreen/OfflinneScreen';
import SplashScreen from "./SplashScreen";
import MoviePlayer from './VideoPlayer/MoviePlayerScreen';

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function AppNavigatorScreen({ route }) {

  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  console.log(pathname)
  const isSplash = pathname === "/";

 useEffect(() => {
  NavigationBar.setPositionAsync("absolute");
  NavigationBar.setBehaviorAsync("overlay-swipe"); // 🔑 KEY LINE
  NavigationBar.setButtonStyleAsync("light");

  if (isSplash) {
    NavigationBar.setBackgroundColorAsync("transparent");
  } else {
    NavigationBar.setBackgroundColorAsync("#0D0E10");
  }
}, [isSplash]);


  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: isSplash ? "transparent" : "#0D0E10",
          paddingBottom: isSplash ? 0 : insets.bottom
        }}>
        <StatusBar translucent backgroundColor="#0D0E10" barStyle="light-content" />
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{
          cardStyle: {
            backgroundColor: "#0D0E10",
            width: windowWidth
          }
        }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{
            headerLeft: () => null,
            headerShown: false,
          }} />  
           <Stack.Screen
            name="OfflineScreen"
            component={OfflineScreen}
            options={{ headerShown: false, 
              presentation: "card",
              animation: 'fade',
              gestureEnabled: false,
             }}
          />
          <Stack.Screen name="BottomAppNavigator" component={BottomAppNavigator} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerLeft: () => null,
            headerShown: false,
          }} />   
          <Stack.Screen name="MoviePlayer" component={MoviePlayer}
            options={{
              presentation: "card",
              animation: 'fade',
              gestureEnabled: false,
              headerShown: false, cardStyle: { backgroundColor: "#0D0E10", width: "100%", height: "100%" }
            }} />
        </Stack.Navigator>
      </View>
    </>
  )
}

const Styles = StyleSheet.create({
  // background: rgb(63,94,251);
  // background: linear-gradient(130deg, rgba(63,94,251,1) 40%, rgba(233,11,110,1) 90%);
})