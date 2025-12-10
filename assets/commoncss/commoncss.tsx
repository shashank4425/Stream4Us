import { Dimensions, StyleSheet } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const commonStyles = StyleSheet.create({
    container: {
        backgroundColor:"#0D0E10",
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin:5
    },
    cards: {
        height: 160,
        width: windowWidth/3.3,        
        borderRadius: 5,
        margin:3
    },
    imgSize: {
        borderRadius: 6,
        height: "100%",
        width: "100%",
        resizeMode:"cover"
    }
})