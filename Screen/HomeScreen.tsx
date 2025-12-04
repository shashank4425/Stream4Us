import TrendingMovies from "@/components/banner/TrendingMovies";
import BannerPreLoaderScreen from "@/components/splash/BannerPreLoaderScreen";
import PreLoaderScreen from "@/components/splash/PreLoaderScreen";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Animated, BackHandler, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Home({ navigation }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchJSON();
    }, []);

    const fetchJSON = async () => {
        try {
            const response = await fetch(
                "https://raw.githubusercontent.com/shashank4425/Stream4Us/refs/heads/movies/common.json"
            );

            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.log("Error fetching JSON:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.replace("Splash");
                setTimeout(() => {
                    BackHandler.exitApp();
                }, 50);

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
    return (
        <View style={Styles.screenContainer}>
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
            {!loading && <Animated.Image
                source={require('../assets/images/stream4us/logo/app-logo-stream4us.png')}
                style={{
                    marginTop: windowHeight / 20,
                    width: windowWidth / 5,
                    padding: 2,
                    position: "absolute",
                    zIndex: 1,
                    height: 30, resizeMode: "contain",
                    opacity: iconOpacity, // 👈 animate visibility
                }}
                resizeMode="contain"
            />}


            <Animated.ScrollView showsVerticalScrollIndicator={false}
                scrollEventThrottle={16} onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}>
                <StatusBar
                    translucent backgroundColor="transparent"
                    barStyle="light-content"
                />
                {loading ? <BannerPreLoaderScreen /> : <TrendingMovies />}
                {loading &&
                    <PreLoaderScreen />
                }
                {!loading && (<View>
                    {data.map(items => {
                        return (
                            <View style={Styles.cardContainer} key={items.id}>
                                <View style={Styles.moviesContent}>
                                    <View style={Styles.leftContent}>
                                        <Text style={Styles.heading}>{items.category}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate(items.category, { title: items.category })}>
                                        <FontAwesome name="angle-right" size={24} color="#fff"></FontAwesome>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView horizontal={true}>
                                    {items.Movies?.map(item => {
                                        return (

                                            <View style={Styles.container} key={item.id}>
                                                <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("MoviePlayer", item)}>
                                                    <View style={Styles.cards}>
                                                        <Image source={{ uri: item.seo.ogImage }}
                                                            style={Styles.imgSize} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        )
                    })}
                </View>)}
            </Animated.ScrollView>
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
        paddingHorizontal: windowWidth / 25,
        paddingVertical: windowHeight / 100
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cards: {
        backgroundColor: "#696969",
        height: 140,
        width: windowWidth / 3.5,
        borderRadius: 6,
        padding: 0,
        marginRight: 5
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

    }
})