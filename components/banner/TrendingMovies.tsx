import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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

const TrendingMovies = () => {
  const navigation = useNavigation();

  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const AUTO_SCROLL_INTERVAL = 4000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!flatListRef.current) return;

      if (activeIndex === bannerList.length - 1) {
        // 🔥 JUMP to first (NO animation)
        flatListRef.current.scrollToOffset({
          offset: 0,
          animated: false,
        });

        // reset animated value manually
        scrollX.setValue(0);
        setActiveIndex(0);
      } else {
        // 👉 Normal quick slide
        flatListRef.current.scrollToOffset({
          offset: (activeIndex + 1) * width,
          animated: true,
        });
      }
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex]);


  /* 👀 Track visible index */
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  /* 🎯 Render Banner */
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.seo.ogImage }} style={styles.image} />

      {/* Dark overlay gradient */}
      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(13,14,16,0)',
          'rgba(13,14,16,0.4)',
          'rgba(13,14,16,0.8)',
          '#0D0E10',
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      />

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('MoviePlayer', item)}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={['#0496FF', '#F20089']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.2, y: 0 }}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <MaterialIcon
              name="play-arrow"
              size={28}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.buttonText}>Watch Now</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  /* 🔵 Animated Dots */
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {bannerList.map((_, i) => {
        const scale = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { transform: [{ scale }], opacity },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={bannerList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {renderDots()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.45,
    marginBottom: 20,
  },

  imageContainer: {
    width,
    height: height * 0.45,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#2A2A2A',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
  },

  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  button: {
    height: 46,
    paddingHorizontal: 34,
    borderRadius: 8,
    justifyContent: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  dotsContainer: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 2,
  },
});


export default TrendingMovies;