
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
const { width, height } = Dimensions.get('window'); 
const BannerPreLoaderScreen = () => {

    return (
        <View>
            {[...Array(1)].map((_, i) => (
                <View
                    key={i}
                    style={{
                        width: width,       // exact 3 items
                        height: height * 0.30,
                        backgroundColor: "#222",
                        borderRadius: 0,
                        marginBottom: 10,   // vertical spacing
                    }}
                />
            ))}
        </View>)
}

const Styles = StyleSheet.create({
    
})
export default BannerPreLoaderScreen;
