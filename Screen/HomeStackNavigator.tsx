import Home from "@/Screen/HomeScreen";
import ActionMovies from "@/Screen/movies/ActionMovies/ActionMovies";
import BhojpuriBhaukalMovies from "@/Screen/movies/BhojpuriMovies/BhojpuriBhaukalMovies";
import GlobalHitsMovies from "@/Screen/movies/GlobalHitsMovies/GlobalHitsMoviesScreen";
import HorrorMovies from "@/Screen/movies/HorrorMovies/HorrorMovies";
import RomanticMovies from "@/Screen/movies/RemanceMovies/RomanticMovies";
import SouthDubbedMovies from "@/Screen/movies/SouthMovies/SouthDubbedMoviesScreen";
import MoviePlayer from "@/Screen/VideoPlayer/MoviePlayerScreen";
import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import BottomAppNavigator from "./BottomAppNavigator";

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
          <Stack.Screen name="Home" component={Home} options={{
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
          <Stack.Screen name="Action Movies" component={ActionMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
          <Stack.Screen name="Global Hits Movies" component={GlobalHitsMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
          <Stack.Screen name="Romantic Movies" component={RomanticMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
          <Stack.Screen name="South Dubbed Movies" component={SouthDubbedMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
          <Stack.Screen name="Bhojpuri Bhaukal" component={BhojpuriBhaukalMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
          <Stack.Screen name="Horror" component={HorrorMovies} options={{
            presentation: "card",
            animation: 'fade',
            gestureEnabled: false,
            headerTitle: () => null, headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#0D0E10", height: windowHeight / 10 },
          }} />
          <Stack.Screen name="MoviePlayer" component={MoviePlayer}
            options={{
              presentation: "card",
              animation: 'fade',
              gestureEnabled: false,
              headerShown: false, cardStyle: { backgroundColor: "#0D0E10", width: "100%", height: "100%" }
            }} />
          
        </Stack.Navigator>
    </>
  )
}

const Styles = StyleSheet.create({
  // background: rgb(63,94,251);
  // background: linear-gradient(130deg, rgba(63,94,251,1) 40%, rgba(233,11,110,1) 90%);
})