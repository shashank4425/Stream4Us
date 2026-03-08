import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.93;
const PREVIEW_WIDTH = width * 0.05;   // 10% previous image
const SPACING = 7;
const CARD_HEIGHT = height * 0.48;

const BannerPreLoaderScreen = () => {

  return (

    <View style={styles.container}>

      <View style={styles.row}>

        {[...Array(2)].map((_, i) => (

          <View key={i} style={styles.cardWrapper}>

            <View style={styles.card} />

          </View>

        ))}

      </View>

    </View>

  );

};

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: CARD_HEIGHT + 80,
    justifyContent: 'center',
    marginTop: 60,
    overflow: 'hidden'
  },

  row: {
    flexDirection: 'row',
    paddingLeft: PREVIEW_WIDTH
  },

  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING
  },

  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#2A2A2A'
  }

});

export default BannerPreLoaderScreen;