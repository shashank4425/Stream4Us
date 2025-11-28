import { commonStyles } from "@/assets/commoncss/commoncss";
import { bhojpuribhaukalmoviesList } from "@/assets/movies/bhojpurimovies/bhojpurimovies";
import { createStackNavigator } from '@react-navigation/stack';
import { useLayoutEffect } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Stack = createStackNavigator();

export default function BhojpuriBhaukalMovies({ navigation, route }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title
    })
  }, [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}>

        {bhojpuribhaukalmoviesList.map(item => {
          return (
            <View key={item.id} style={commonStyles.cards}>
              <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("MoviePlayer", item)}>
                
                  <Image source={{ uri: item.seo.ogImage }} style={commonStyles.imgSize} />
                
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
const Styles = StyleSheet.create({
})