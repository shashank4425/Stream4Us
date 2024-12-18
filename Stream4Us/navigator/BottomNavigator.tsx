import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import 'react-native-gesture-handler'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Movies from '@/Screen/Movies';

import Series from "@/Screen/Series/Series";
import Home from '@/Screen/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import HollwoodMovies from '@/Screen/HollywoodMoviesScreen';
const BottomTab= createBottomTabNavigator();

export default function BottomNavigator({navigation}: {navigation: any}) {
    return (
      <BottomTab.Navigator screenOptions={{
       tabBarStyle:{
        backgroundColor:"#0D0E10",
        margin:0
       }
      }}>
        <BottomTab.Screen name='Main' component={Home} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ), headerShown:false,
          headerLeft:()=>null
        }}/>
        <BottomTab.Screen name='Movies' component={Movies} 
        options={{headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv" color={color} size={size} />
          ),
        }}/>
        <BottomTab.Screen name='Series' component={Series} 
        options={{headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="watch" color={color} size={size} />
          ),
        }}/>
      </BottomTab.Navigator>
    )
  };

  const style = StyleSheet.create({

  })