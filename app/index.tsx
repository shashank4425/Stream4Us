import { registerRootComponent } from 'expo';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import AppNavigatorScreen from '../Screen/AppNavigatorScreen';

export default function Main() {
  useEffect(() => {
    async function prepareSystemUI() {
      if (Platform.OS === 'android') {
        // Sets the background color
        await NavigationBar.setBackgroundColorAsync('#0D0E10');
        
        // "light" means white icons (for dark backgrounds)
        // "dark" means dark icons (for light backgrounds)
        await NavigationBar.setButtonStyleAsync("light"); 
        
        // Optional: Ensure the bar is visible
        await NavigationBar.setVisibilityAsync("visible");
      }
    }

    prepareSystemUI();
  }, []);

  return <AppNavigatorScreen />;
}

registerRootComponent(Main);