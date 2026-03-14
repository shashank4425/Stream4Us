import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from "../../app/src/theme/fonts";

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
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
                  styles.image
                ]}
                fadeDuration={0}
                onLoad={() => handleLoad(i)}
              />

              {/* Bottom Gradient */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              />

              {/* LEFT TEXT */}
              <View style={styles.textContainer}>
                {/* <Text style={styles.pageText}>{item.seo.page}</Text> */}
                <Image
                  source={{ uri: item.seo?.ogLogo }}   // or any field you have
                  style={styles.ogImage} />
                <Text style={styles.bannerInfo}>{item.bannerInfo}</Text>
              </View>
              <TouchableOpacity
                style={styles.playButtonOuter}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('MoviePlayer', item)}
              >
                <View style={styles.playButtonInner}>
                  <MaterialIcon name="play-arrow" size={28} color="#333" style={{ marginLeft: 2 }} />
                </View>
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
    height: CARD_HEIGHT + 70,
    justifyContent: 'center',
    marginTop: 60,
    overflow: 'hidden'
  },

  row: {
    flexDirection: 'row'
  },

  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    elevation: 6
  },

  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent'
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  ogImage: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 6
  },
  textContainer: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    right: 80   // leave space for play button
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%'
  },

  bannerInfo: {
    fontWeight: 600,
    fontSize: 14,
    fontFamily: FONTS['Roboto-Bold'],
    color: '#A9A9A9',
    marginTop: 4
  },

  pageText: {
    fontSize: 26,
    fontFamily: FONTS['Roboto-Medium'],
    color: '#FFFFFF'
  },
  playButtonOuter: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#e5e5e5',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#ffffff',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8
  },

  playButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 36,
    backgroundColor: '#dcdcdc',

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9a9a9a',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4
  }

});

export default TrendingMovies;