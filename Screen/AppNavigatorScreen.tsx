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
import React from 'react';
import { Dimensions, StatusBar, StyleSheet } from "react-native";
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
  // useEffect(() => {
  //   const handleAppStateChange = async (nexAppState) =>{
  //     if(nexAppState === 'active'){
  //       SplashScreen.preventAutoHideAsync();
  //       setTimeout(async () => {
  //         await SplashScreen.hideAsync();
  //       }, 3500); 
  //      }
  //     }
  //     AppState.addEventListener('change', handleAppStateChange);
  //   return () => {
  //     SplashScreen.preventAutoHideAsync(); 
  //   };
  // }, []);
 
  return (
    <>
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>        
     <Stack.Navigator initialRouteName="Home" screenOptions={{
        cardStyle: {
          backgroundColor:"#0D0E10",
          width:windowWidth,
          paddingBottom:windowHeight/15
        }
      }}>
    <Stack.Screen name="Home" component={Home} options={{
      headerLeft:()=>null,
      headerShown:false,
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
      headerTintColor:"#ffffff"
    }}/> 
    <Stack.Screen name="Action Movies" component={ActionMovies} options={{
      headerTitle:() => null, headerTintColor:"#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="Global Hits Movies" component={GlobalHitsMovies} options={{
      headerTitle:() => null, headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="Romantic Movies" component={RomanticMovies} options={{
      headerTitle:() => null, headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>      
    <Stack.Screen name="South Dubbed Movies" component={SouthDubbedMovies} options={{
      headerTitle:() => null,  headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
      
      <Stack.Screen name="Bhojpuri Bhaukal" component={BhojpuriBhaukalMovies} options={{
      headerTitle:() => null,  headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="Horror" component={HorrorMovies} options={{
      headerTitle:() => null,  headerTintColor: "#FFF", 
      headerStyle: {backgroundColor:"#0D0E10", height:windowHeight/10},
    }}/>
    <Stack.Screen name="MoviePlayer" component={MoviePlayer} 
       options={{
         animation: 'slide_from_bottom',
         gestureEnabled: true,
          gestureDirection: 'vertical',
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