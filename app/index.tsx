import { registerRootComponent } from 'expo';
import React from 'react';
import AppNavigatorScreen from '../Screen/AppNavigatorScreen';

export default function Main() {
  return <AppNavigatorScreen />;
}

registerRootComponent(Main);