import { FontAwesome } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { FONTS } from "../app/src/theme/fonts";

import TrendingMovies from "@/components/banner/TrendingMovies";
import React, { useRef, useState } from "react";
import { Animated, BackHandler, Dimensions, FlatList, Image, NativeModules, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NoInternetModal from "../Screen/OfflineScreen/NoInternetModal";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const { PipModule } = NativeModules;
export default function Home({ navigation, route }) {
   const jsonResponse = route?.params?.jsonResponse || [];
    const redirected = useRef(false);
    const [showNoInternet, setShowNoInternet] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                BackHandler.exitApp();
                return true;
            };

            const handler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => handler.remove(); // remove when leaving Home
        }, [])
    );

    const [scrollY] = useState(new Animated.Value(0));
    const STATUS_BAR_HEIGHT = Constants.statusBarHeight;

    const bgColor = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,1)"],
        extrapolate: "clamp",
    });

    const iconOpacity = scrollY.interpolate({
        inputRange: [0, 100],     // same as bgColor change
        outputRange: [1, 0],      // show → hide
        extrapolate: "clamp",
    });

    const onMoviePress = async (item) => {
        const net = await NetInfo.fetch();

        if (net.isConnected) {
            navigation.navigate("MoviePlayer", item);
        } else {
            setShowNoInternet(true);
        }
    };

    const onCategoryPress = async (item) => {
    const net = await NetInfo.fetch();

    if (net.isConnected) {

        navigation.navigate("CategoryBasedMovies", {
            title: item.category,
            movies: item.Movies
        });

    } else {
        setShowNoInternet(true);
    }
};

    return (
        <View style={{
            flex: 1, backgroundColor: "#0D0E10", marginBottom: 84
        }}>
            <Animated.View
                style={{
                    height: STATUS_BAR_HEIGHT,
                    backgroundColor: bgColor,
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    zIndex: 10,
                }}
            />
            {<Animated.Image
                source={require('../assets/images/stream4us/logo/stream4us.png')}
                style={{
                    marginTop: windowHeight / 28,
                    width: windowWidth / 4.5,
                    padding: 0,
                    position: "absolute",
                    zIndex: 1,
                    height: 56, resizeMode: "contain",
                    opacity: iconOpacity, // 👈 animate visibility
                }}
                resizeMode="contain"
            />}
            <StatusBar
                translucent backgroundColor="transparent"
                barStyle="light-content"
            />

            <Animated.FlatList
                showsVerticalScrollIndicator={false}
                // 🟢 TRACK SCROLL POSITION
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                data={jsonResponse || []}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => (<TrendingMovies />
                )}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 16 }}>
                        <View style={Styles.cardContainer}>
                            <View
                                style={{
                                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                    paddingHorizontal: 10, marginBottom: 4,
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontFamily:FONTS.semiBold,
                                    marginBottom: 10
                                }}>
                                    {item.category}
                                </Text>
                                <TouchableOpacity activeOpacity={1} onPress={() => onCategoryPress(item)}>
                                    <FontAwesome name="angle-right" size={22} color="#fff"></FontAwesome>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={item?.Movies || []}
                                keyExtractor={(movie, index) => movie.id?.toString() || index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity activeOpacity={1}
                                        onPress={() => onMoviePress(item)}>
                                        <Image
                                            source={{ uri: item.seo.ogImage }}
                                            style={{
                                                resizeMode: "cover",
                                                height: 155,
                                                width: windowWidth / 3.4,
                                                borderRadius: 8,
                                                marginHorizontal: 3,
                                                backgroundColor: "#333"
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                )}
            />
            <NoInternetModal
                visible={showNoInternet}
                onClose={() => setShowNoInternet(false)}
            />
        </View>
    )
}
const Styles = StyleSheet.create({
    preLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preLoadingImg: {
        resizeMode: "contain"
    },
    screenContainer: {
        flex: 1,
        backgroundColor: "#0D0E10",
        flexDirection: 'column',
        flexWrap: 'nowrap'
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: StatusBar.currentHeight || 40,
        zIndex: 999,
    },
    cardContainer: {
        margin: 6,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cards: {
        backgroundColor: "#696969",
        height: 160,
        width: windowWidth / 3.5,
        borderRadius: 6,
        padding: 0,
        marginRight: 4
    },
    imgSize: {
        borderRadius: 6,
        height: "100%",
        width: "100%",
        resizeMode: "cover"
    },
    heading: {
        color: "#ffffff",
        fontWeight: "bold",
        justifyContent: "flex-start",
        textAlign: "left",
        fontSize: 16
    },
    title: {
        color: "#ffffff",
        fontWeight: "bold",
        alignItems: "flex-start",
        fontSize: 4
    },
    leftContent: {
        width: windowWidth / 1.2
    },
    moviesContent: {
        width: windowWidth,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        display: "flex",
        padding: windowWidth / 60

    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,        // ✅ ABOVE gradient
    },
    button: {
        height: 36,
        paddingHorizontal: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        shadowColor: 'transparent',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconWrapper: {
        width: 32,
        height: 30,
        borderRadius: 4,          // 👈 subtle radius
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    playIcon: {
        marginRight: 6, // 👈 tight spacing like OTT apps
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    }
})