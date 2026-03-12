import Home from "@/Screen/HomeScreen";
import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import { Dimensions } from "react-native";
import BottomAppNavigator from "./BottomAppNavigator";
import CategoryBasedMovies from "./movies/CategoryBasedMovies";

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function HomeStackNavigator({ route }) {

  return (
    <>
        <Stack.Navigator initialRouteName="Home" screenOptions={{
          cardStyle: {
            backgroundColor: "#0D0E10",
            width: windowWidth
          }}}>
          <Stack.Screen name="Home" initialParams={{ jsonResponse: route?.params?.jsonResponse }} component={Home} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerLeft: () => null,
            headerShown: false,
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
            headerTintColor: "#ffffff"
          }} />
          <Stack.Screen
          name="BottomAppNavigator"
          component={BottomAppNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen name="CategoryBasedMovies" component={CategoryBasedMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
        </Stack.Navigator>
    </>
  )
}
