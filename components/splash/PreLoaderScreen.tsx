
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PreLoaderScreen = () => {

    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                padding: 10,
            }}
        >
            <View style={Styles.moviesContent}>
                <View style={{ width: "40%", backgroundColor: "#222" }}>
                </View>
                <View style={{ width: "9%", backgroundColor: "#222" }}>
                </View>
            </View>
            {[...Array(12)].map((_, i) => (
                <View
                    key={i}
                    style={{
                        width: "32%",       // exact 3 items
                        height: 150,
                        backgroundColor: "#222",
                        borderRadius: 8,
                        marginBottom: 10,   // vertical spacing
                    }}
                />
            ))}
        </View>)
}

const Styles = StyleSheet.create({
   leftContent: {
        width: windowWidth / 1.2
    },
    moviesContent: {
        width: windowWidth,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        display: "flex",
        padding: windowWidth / 60

    }     
})
export default PreLoaderScreen;
