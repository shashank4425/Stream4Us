import { commonStyles } from "@/assets/commoncss/commoncss";
import PreLoaderScreen from "@/components/splash/PreLoaderScreen";
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useLayoutEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Stack = createStackNavigator();
export default function SouthDubbedMovies({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchJSON();
  }, []);

  const fetchJSON = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/shashank4425/Stream4Us/refs/heads/movies/south/movies.json"
      );

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("Error fetching JSON:", error);
    } finally {
      setLoading(false);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title
    })
  }, [navigation]);

  if (loading) {
    return (
       <PreLoaderScreen/>
    )
  }
  if (!loading) {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={commonStyles.container}>

          {data.map(item => {
            return (
              <View key={item.id} style={commonStyles.cards}>
                <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("ActionMovie", item)}>

                  <Image source={{ uri: item.seo.ogImage }} style={commonStyles.imgSize} />

                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}
const Styles = StyleSheet.create({

})