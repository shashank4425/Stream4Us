import Home from "@/Screen/HomeScreen";
import ActionMovies from "@/Screen/movies/ActionMovies/ActionMovies";
import BhojpuriBhaukalMovies from "@/Screen/movies/BhojpuriMovies/BhojpuriBhaukalMovies";
import GlobalHitsMovies from "@/Screen/movies/GlobalHitsMovies/GlobalHitsMoviesScreen";
import HorrorMovies from "@/Screen/movies/HorrorMovies/HorrorMovies";
import RomanticMovies from "@/Screen/movies/RemanceMovies/RomanticMovies";
import SouthDubbedMovies from "@/Screen/movies/SouthMovies/SouthDubbedMoviesScreen";
import MoviePlayer from "@/Screen/VideoPlayer/MoviePlayerScreen";
import { DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from 'react';
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import SplashScreen from "./SplashScreen";
NavigationBar.setBackgroundColorAsync("#0D0E10");  
const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const DarkTheme = {
   ...DefaultTheme,
   colors: {
     ...DefaultTheme.colors,
       background: "#0D0E10",
       card: "#0D0E10",
       text: "#FFFFFF"
     }
}
export default function AppNavigatorScreen({route}){
 useEffect(() => {
    // FULL immersive mode globally
    NavigationBar.setVisibilityAsync("visible");
  }, []);
 
  return (
    <>
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>        
     <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{
        cardStyle: {
          backgroundColor:"#0D0E10",
          width:windowWidth,
          paddingBottom:windowHeight/15
        }
      }}>
     <Stack.Screen name="SplashScreen" component={SplashScreen} options={{
      headerLeft:()=>null,
      headerShown:false
    }}/>    
    <Stack.Screen name="Home" component={Home} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerLeft:()=>null,
      headerShown:false,
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
      headerTintColor:"#ffffff"
    }}/> 
    <Stack.Screen name="Action Movies" component={ActionMovies} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerTitle:() => null, headerTintColor:"#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="Global Hits Movies" component={GlobalHitsMovies} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerTitle:() => null, headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="Romantic Movies" component={RomanticMovies} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerTitle:() => null, headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>      
    <Stack.Screen name="South Dubbed Movies" component={SouthDubbedMovies} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerTitle:() => null,  headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
      <Stack.Screen name="Bhojpuri Bhaukal" component={BhojpuriBhaukalMovies} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerTitle:() => null,  headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="Horror" component={HorrorMovies} options={{
      presentation:"transparentModal",
      animation: 'fade',
      gestureEnabled: true,
      headerTitle:() => null,  headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="MoviePlayer" component={MoviePlayer} 
       options={{
         presentation:"transparentModal",
         animation: 'fade',
         gestureEnabled: true,
         headerShown:false, cardStyle: {backgroundColor:"#0D0E10", width:"100%", height:"100%"}
          }}/>
    </Stack.Navigator>
     </>
    )
}

const Styles = StyleSheet.create({
  // background: rgb(63,94,251);
  // background: linear-gradient(130deg, rgba(63,94,251,1) 40%, rgba(233,11,110,1) 90%);
})