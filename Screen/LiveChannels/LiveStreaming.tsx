import PreLoaderScreen from "@/components/splash/PreLoaderScreen";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const NUM_COLUMNS = 3;
const ITEM_SPACING = 8;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE =
  (SCREEN_WIDTH - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LiveStreaming({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params?.title || "Live TV",
    });
  }, [navigation, route]);

  const stream_list =
    "https://raw.githubusercontent.com/shashank4425/Stream4Us/refs/heads/movies/stream_list.json";

  // ---------------- FETCH JSON ----------------
  useEffect(() => {
    const fetchJSON = async () => {
      try {
        const response = await fetch(stream_list);
        const jsonData = await response.json();

        // Add unique id
        const withId = jsonData.map((item, index) => ({
          ...item,
          id: `channel-${index}`,
        }));

        setChannels(withId);
      } catch (error) {
        console.log("Error fetching JSON:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJSON();
  }, []);

  if (loading) return <PreLoaderScreen />;

  return (
    <View style={{
      flex: 1, backgroundColor: "#0D0E10"
    }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={channels}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <View style={Styles.cardContainer}>
              <View
                style={{
                  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  paddingHorizontal: 15, marginBottom: 6,
                }}>
                <Text style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 10
                }}>
                  {item.category}
                </Text>
              </View>
              <FlatList
                data={item.Movies}
                keyExtractor={(movie) => movie.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={{ alignItems: "center", marginHorizontal: 3 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => navigation.navigate("MoviePlayer", item)}
                    >
                      {item.logo ? (
                        <Image
                          source={{ uri: item.logo }}
                          style={{
                            resizeMode: "contain",
                            height: 100,
                            width: windowWidth / 3.4,
                            borderRadius: 8,
                            backgroundColor: "#333",
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            height: 100,
                            width: windowWidth / 3.4,
                            borderRadius: 8,
                            backgroundColor: "#333",
                          }}
                        />
                      )}
                    </TouchableOpacity>

                    {/* 🔹 NAME JUST BELOW IMAGE */}
                    <Text
                      numberOfLines={2}
                      style={{
                        marginTop: 6,
                        width: windowWidth / 3.4,
                        color: "#fff",
                        fontSize: 12,
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                )}
              />


            </View>
          </View>
        )}
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