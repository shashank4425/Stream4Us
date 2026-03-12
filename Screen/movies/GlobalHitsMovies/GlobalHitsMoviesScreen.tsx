import { commonStyles } from "@/assets/commoncss/commoncss";
import PreLoaderScreen from "@/components/splash/PreLoaderScreen";
import NoInternetModal from "@/Screen/OfflineScreen/NoInternetModal";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
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

  // Load movies from params
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
    <ScrollView showsVerticalScrollIndicator={false}>

      <View style={commonStyles.container}>

        {data.map((item) => (

          <View key={item.id} style={commonStyles.cards}>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onMoviePress(item)}
            >

              <Image
                source={{ uri: item.seo.ogImage }}
                style={commonStyles.imgSize}
              />

            </TouchableOpacity>

          </View>

        ))}

      </View>

      <NoInternetModal
        visible={showNoInternet}
        onClose={() => setShowNoInternet(false)}
      />

    </ScrollView>
  );
}