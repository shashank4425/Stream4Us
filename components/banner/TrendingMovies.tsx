import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bannerList } from "../../assets/bannerList/bannerList";
const { width, height } = Dimensions.get('window');

const TrendingMovies = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const [data, setData] = useState([...bannerList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => {
        let nextIndex = prevIndex + 1;
        if (nextIndex >= data.length) {
          setData(prev => [...prev, ...bannerList]);
        }
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: index,
      });
    }
  }, [index]);

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.seo.ogImage }} style={styles.image} />

      {/* Dark image gradient */}
      <LinearGradient
        pointerEvents="none"   // ✅ IMPORTANT
        colors={[
          'rgba(13,14,16,0)',    // transparent version of #0D0E10
          'rgba(13,14,16,0.4)',
          'rgba(13,14,16,0.8)',
          '#0D0E10'
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      />

      {/* Button ABOVE gradient */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MoviePlayer', item)}
        style={styles.buttonWrapper}   // 👈 MOVE style HERE
      >
        <LinearGradient
          colors={['#2278FB', '#F4119E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Watch Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index}
        horizontal
        scrollEnabled={false}  // 👈 IMPORTANT
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.flatListContent}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    height: height * 0.45,   // FIX: define height and remove flex:1
  },
  imageContainer: {
    width: width,
    height: height * 0.45,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    backgroundColor: "#696969",
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    zIndex: 1,        // gradient layer
  },

  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,        // ✅ ABOVE gradient
  },

  button: {
    height: 44,
    paddingHorizontal: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  flatListContent: {
    paddingHorizontal: 0,
  }
});

export default TrendingMovies;