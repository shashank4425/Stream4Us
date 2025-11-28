import { commonStyles } from "@/assets/commoncss/commoncss";
import { southdubbedmoviesList } from "@/assets/movies/southmovies/southmoviesinhindi";
import { createStackNavigator } from '@react-navigation/stack';
import { useLayoutEffect } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Stack = createStackNavigator();
export default function SouthDubbedMovies({ navigation, route }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title
    })
  }, [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}>

        {southdubbedmoviesList.map(item => {
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
const Styles = StyleSheet.create({

})