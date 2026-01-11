import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import HomeStackNavigator from './HomeStackNavigator';
import LiveStackNavigator from './LiveStackNavigator';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50, // 🔥 EXACT system bar height
        flexDirection: 'row',
        backgroundColor: '#0D0E10',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = route.name === 'Home' ? 'home' : 'live-tv';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcon
              name={icon}
              size={22}
              color={focused ? '#fff' : '#777'}
            />
            <Text
              style={{
                fontSize: 11,
                lineHeight: 8,
                marginTop:4,   // 🔥 overlay text
                color: focused ? '#fff' : '#777',
              }}
            >
              {route.name === 'Home' ? 'Home' : 'Live TV'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

  );
}

/* ---------------- TAB NAVIGATOR ---------------- */
export default function BottomAppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="LiveStreaming" component={LiveStackNavigator} />
    </Tab.Navigator>
  );
}
