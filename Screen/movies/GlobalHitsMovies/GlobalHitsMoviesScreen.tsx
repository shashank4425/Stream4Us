import { commonStyles } from "@/assets/commoncss/commoncss";
import PreLoaderScreen from "@/components/splash/PreLoaderScreen";
import NoInternetModal from "@/Screen/OfflineScreen/NoInternetModal";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GlobalHitsMovies({ navigation, route }) {

 const { title, movies } = route.params;

  const insets = useSafeAreaInsets();

  const [showNoInternet, setShowNoInternet] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title
    });
  }, [navigation, title]);

  useEffect(() => {
    if (movies) {
      setData(movies);
      setLoading(false);
    }
  }, [movies]);

  const onMoviePress = async (item) => {

    const net = await NetInfo.fetch();

    if (net.isConnected) {
      navigation.navigate("MoviePlayer", item);
    } else {
      setShowNoInternet(true);
    }
  };

  if (loading) {
    return <PreLoaderScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 6,
          paddingBottom: 120   // 👈 important
        }}
        renderItem={({ item }) => (
          <View style={commonStyles.cards}>
            <TouchableOpacity activeOpacity={1} onPress={() => onMoviePress(item)}>
              <Image
                source={{ uri: item?.seo?.ogImage }}
                style={commonStyles.imgSize}
              />
            </TouchableOpacity>
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