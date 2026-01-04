import { commonStyles } from "@/assets/commoncss/commoncss";
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Stack = createStackNavigator();

export default function LiveStreaming({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     fetchJSON();
//   }, []);

//   const fetchJSON = async () => {
//     try {
//       const response = await fetch(
//         "https://raw.githubusercontent.com/shashank4425/Stream4Us/refs/heads/movies/bollywood/action/movies.json"
//       );
//       const jsonData = await response.json();
      
//       setData(jsonData);
//     } catch (error) {
//       console.log("Error fetching JSON:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: route.params.title
//     })
//   }, [navigation]);

//   if (loading){
//     return (
//        <PreLoaderScreen/>
//     )
//   }
//  if (!loading){
     return (
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={commonStyles.container}>
          <Text>This will be live streaming</Text>
        </View>
      </ScrollView>
    )
  }
//}
const Styles = StyleSheet.create({

})