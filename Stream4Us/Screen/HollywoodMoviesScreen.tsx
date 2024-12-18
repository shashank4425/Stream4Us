import react, { useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { hollywoodmoviesList } from "../assets/movies/hollywoodmovies/hollywoodmovies";
import { TouchableOpacity } from "react-native-gesture-handler";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Hollywood({navigation,route}) {
    return (
        <SafeAreaView style={Styles.screenContainer}>
            <View>
                
                <ScrollView>
                    <View style={Styles.container}>
                        {hollywoodmoviesList.map(item=>{
                           return (                            
                             <View key={item.id} style={Styles.cards}>
                              <TouchableOpacity onPress={() => navigation.navigate("MoviePlayer", item)}>  
                              <Image source={{uri:item.seo.ogImage}} 
                               style={Styles.imgSize}/>
                               <Text numberOfLines={1} style={Styles.title}>{item.fullTitle}</Text>
                               </TouchableOpacity>                             
                             </View>
                           )  
                        })}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
const Styles = StyleSheet.create({
    screenContainer: {
        flex:1,
       backgroundColor:"#0D0E10",
        flexDirection: 'column',
        flexWrap: 'nowrap',
         padding:0
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cards: {
        height: 190,
        width: 122,
        backgroundColor: "#0D0E10",
        borderRadius: 4,
        padding: 4,
        margin: 3   
    },
    imgSize: {
        height:140,
        width:122,
    },
    title: {
        color: "#808080",
        fontWeight: "bold",
        alignItems: "flex-start",
        fontSize: 16,
        padding:6,
        textAlign: "center",
        justifyContent: "center"
    }    
})