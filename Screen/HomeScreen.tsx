import TrendingMovies from "@/components/banner/TrendingMovies";
import { FontAwesome } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
    Animated,
    BackHandler,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { FONTS } from "../app/src/theme/fonts";
import NoInternetModal from "../Screen/OfflineScreen/NoInternetModal";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Home({ navigation, route }) {
    const jsonResponse = route?.params?.jsonResponse || [];
    const [showNoInternet, setShowNoInternet] = useState(false);

    const [arrowIndex, setArrowIndex] = useState(null);

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

            return () => handler.remove();
        }, [])
    );

    const cardWidth = windowWidth / 3.4;
    const cardMargin = 3;


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
        if (net.isConnected) navigation.navigate("MoviePlayer", item);
        else setShowNoInternet(true);
    };

    const onCategoryPress = async (item) => {
        const net = await NetInfo.fetch();
        if (net.isConnected) {
            navigation.navigate("CategoryBasedMovies", {
                title: item.category,
                movies: item.Movies,
            });
        } else setShowNoInternet(true);
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
            < Animated.FlatList
                showsVerticalScrollIndicator={false}
                data={jsonResponse}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => <TrendingMovies />}
                renderItem={({ item, index }) => (
                    <View style={{ marginBottom: 16 }}>
                        <View style={Styles.cardContainer}>

                            {/* Category Header */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                    marginBottom: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 18,
                                        fontFamily: FONTS["Roboto-Bold"],
                                    }}
                                >
                                    {item.category}
                                </Text>

                                {arrowIndex === index && (
                                    <TouchableOpacity
                                        onPress={() => onCategoryPress(item)}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesome name="angle-right" size={24} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Horizontal Movies */}
                            <Animated.FlatList
                                data={item?.Movies || []}
                                keyExtractor={(movie, idx) =>
                                    movie.id?.toString() || idx.toString()
                                }
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                scrollEventThrottle={16}
                                onScroll={({ nativeEvent }) => {
                                    const offsetX = nativeEvent.contentOffset.x;

                                    if (offsetX > 100) {
                                        setArrowIndex(index);
                                    } else {
                                        setArrowIndex(null);
                                    }
                                }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => onMoviePress(item)}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{ uri: item.seo.ogImage }}
                                            style={{
                                                height: 155,
                                                width: cardWidth,
                                                borderRadius: 8,
                                                marginHorizontal: cardMargin,
                                                backgroundColor: "#333",
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
    );
}

const Styles = StyleSheet.create({
    cardContainer: {
        margin: 6,
    },
});