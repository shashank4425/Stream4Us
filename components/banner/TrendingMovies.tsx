import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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

  const renderItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("MoviePlayer", item)}>
        <Image source={{ uri: item.seo.ogImage }} style={styles.image} />
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
    marginBottom:20,
    height: height * 0.30,   // FIX: define height and remove flex:1
  },
  imageContainer: {
    width: width,
    height: height * 0.30,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    backgroundColor: "#696969",
  },
  flatListContent: {
    paddingHorizontal: 0,
  },
});

export default TrendingMovies;
