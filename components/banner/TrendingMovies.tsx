import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { bannerList } from "../../assets/bannerList/bannerList";

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.86;
const SCROLL_GAP = 16;
const CARD_HEIGHT = height * 0.46;

const STACK_X = 15;
const STACK_Y = 5;

const TrendingMovies = () => {
  const animatedIndex = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const AUTO_SCROLL_INTERVAL = 3600;

  /* Auto loop scroll */

  useEffect(() => {

    const interval = setInterval(() => {

      setIndex(prev => {

        const next = (prev + 1) % bannerList.length;

        Animated.timing(animatedIndex, {
          toValue: next,
          duration: 800,
          useNativeDriver: true
        }).start();

        return next;

      });

    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);

  }, []);
  const renderCard = (item, i) => {

    const position = Animated.subtract(i, animatedIndex);

    const translateX = position.interpolate({
      inputRange: [-1, 0, 1, 2],
      outputRange: [-(CARD_WIDTH + SCROLL_GAP), 0, STACK_X, STACK_X * 2],
      extrapolate: "clamp"
    });
    const translateY = position.interpolate({
      inputRange: [-1, 0, 1, 2],
      outputRange: [0, 0, STACK_Y, STACK_Y * 2],
      extrapolate: "clamp"
    });

    const scale = position.interpolate({
      inputRange: [-1, 0, 1, 2],
      outputRange: [1, 1, 0.95, 0.9],
      extrapolate: "clamp"
    });

    const opacity = position.interpolate({
      inputRange: [-2, -1, 0, 1, 2],
      outputRange: [0, 1, 1, 1, 1],
      extrapolate: "clamp"
    });

     const zIndex = position.interpolate({
      inputRange: [-1, 0, 1, 2],
      outputRange: [2, 4, 3, 2],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.card,
          {
            zIndex: zIndex,
            opacity,
            transform: [
              { translateX },
              { translateY },
              { scale }
            ]
          }
        ]}
      >

        <Image
          source={{ uri: item?.seo?.ogImage }}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MoviePlayer', item)}
        >
          <MaterialIcon name="play-arrow" size={30} color="#fff" />
        </TouchableOpacity>

      </Animated.View>
    );
  };
  return (

    <View style={styles.container}>

      {bannerList.map((item, i) => renderCard(item, i))}

    </View>

  );

};



const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: CARD_HEIGHT + 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },

  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  playButton: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F20089',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8
  }

});

export default TrendingMovies;