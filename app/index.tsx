import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigatorScreen from '../Screen/AppNavigatorScreen';

function Main() {
  return (
    <SafeAreaProvider>
        <AppNavigatorScreen />
    </SafeAreaProvider>
  );
}

registerRootComponent(Main);
export default Main;
