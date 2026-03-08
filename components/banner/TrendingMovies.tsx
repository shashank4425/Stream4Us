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

const CARD_WIDTH = width * 0.93;
const PREVIEW_WIDTH = width * 0.05;   // 10% previous image
const SPACING = 7;

const ITEM_WIDTH = CARD_WIDTH + SPACING;
const CARD_HEIGHT = height * 0.48;

const AUTO_SCROLL_INTERVAL = 3600;

const data = [...bannerList, bannerList[0]];

const TrendingMovies = () => {

  const navigation = useNavigation();

  const scrollX = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);

  const [loadedImages, setLoadedImages] = useState({});

  const handleLoad = (index) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  useEffect(() => {

    const interval = setInterval(() => {

      indexRef.current += 1;

      Animated.timing(scrollX, {
        toValue: indexRef.current * ITEM_WIDTH,
        duration: 800,
        useNativeDriver: true
      }).start(() => {

        if (indexRef.current === data.length - 1) {

          indexRef.current = 0;
          scrollX.setValue(0);

        }

      });

    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);

  }, []);

  return (

    <View style={styles.container}>

      <Animated.View
        style={[
          styles.row,
          {
            paddingLeft: PREVIEW_WIDTH,
            paddingRight: CARD_WIDTH, // hides next image
            transform: [{ translateX: Animated.multiply(scrollX, -1) }]
          }
        ]}
      >

        {data.map((item, i) => (

          <View key={i} style={styles.cardWrapper}>

            <View style={styles.card}>

              <Image
                source={{ uri: item?.seo?.ogImage }}
                style={[
                  styles.image,
                  { opacity: loadedImages[i] ? 1 : 0 }
                ]}
                fadeDuration={0}
                onLoad={() => handleLoad(i)}
              />

              <TouchableOpacity
                style={styles.playButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('MoviePlayer', item)}
              >
                <MaterialIcon name="play-arrow" size={30} color="#fff" />
              </TouchableOpacity>

            </View>

          </View>

        ))}

      </Animated.View>

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
    flexDirection: 'row'
  },

  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING
  },

  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0D0E10',
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