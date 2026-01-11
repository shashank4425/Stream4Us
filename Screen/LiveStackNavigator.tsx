import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiveStreaming from "../Screen/LiveChannels/LiveStreaming";

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LiveStackNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle: {
                    backgroundColor: "#0D0E10",
                    width: windowWidth,
                },
            }}
        >
            <Stack.Screen
                name="LiveStreaming"
                component={LiveStreaming}
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerStatusBarHeight: insets.top, // 🔥 THIS FIXES IT
                    headerStyle: {
                        backgroundColor: "#0D0E10",
                        height: windowHeight / 10,
                    },
                    headerTintColor: "#ffffff",
                }}
            />
        </Stack.Navigator>
    );
}
