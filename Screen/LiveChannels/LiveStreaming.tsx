import { commonStyles } from "@/assets/commoncss/commoncss";
import PreLoaderScreen from "@/components/splash/PreLoaderScreen";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const NUM_COLUMNS = 4;
const ITEM_SPACING = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;

const ITEM_SIZE =
  (SCREEN_WIDTH - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function LiveStreaming({navigation, route}) {

  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [parsingDone, setParsingDone] = useState(false);

  useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: route.params.title
      })
    }, [navigation]);
  const m3uUrl =
    "https://raw.githubusercontent.com/FunctionError/PiratesTv/main/combined_playlist.m3u";

  // 🔹 sanitize name (ONLY remove icons/emojis + new lines)
  function sanitizeName(name) {
    return name
      .replace(/[\r\n]+/g, ' ')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const validUrlRegex = /^https:\/\/[^\s]+$/;

  async function loadM3U() {
    const response = await fetch(m3uUrl);
    return response.text();
  }

   function parseM3UChunked(text) {
  const lines = text.split(/\r?\n/);
  let index = 0;
  let currentName = '';
  let currentLogo = null;

  const CHUNK_SIZE = 200;
  const validUrlRegex = /^https:\/\/[^\s]+$/; // ✅ https only, no spaces

  function processChunk() {
    const chunk = [];

    while (index < lines.length && chunk.length < CHUNK_SIZE) {
      const line = lines[index++].trim();
      if (!line) continue;

      if (line.startsWith('#EXTINF')) {
        const rawName = line.split(',').pop() || '';
        currentName = sanitizeName(rawName);

        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        currentLogo = logoMatch?.[1]?.trim() || null;
      }

      // ✅ FINAL URL FILTER
      if (validUrlRegex.test(line)) {
        chunk.push({
          url: line,
          name: currentName,
          logo: currentLogo,
        });
      }
    }

    if (chunk.length) {
      setChannels(prev => [...prev, ...chunk]);
    }

    if (index < lines.length) {
      setTimeout(processChunk, 0);
    } else {
      setParsingDone(true);
    }
  }

  processChunk();
}


  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const text = await loadM3U();
      parseM3UChunked(text);
    });
  }, []);

  useEffect(() => {
    if (parsingDone) {
      console.log('✅ PARSING COMPLETE');
      console.log('📺 TOTAL CHANNELS:', channels.length);
      console.log(channels);
      setLoading(false);
    }
  }, [parsingDone]);

  const renderItem = ({ item }) => (
    <View style={{ width: ITEM_SIZE, margin: ITEM_SPACING / 2 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MoviePlayer', {
            streamUrl: item.url,
            title: item.name,
          })
        }
      >
        {item.logo ? (
          <Image
            source={{ uri: item.logo }}
            style={{ width: ITEM_SIZE, height: ITEM_SIZE * 0.75, borderRadius: 10 }}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[
              styles.blackCard,
              { width: ITEM_SIZE, height: ITEM_SIZE * 0.75 },
            ]}
          >
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) return <PreLoaderScreen />;

  return (
    <View style={commonStyles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={channels}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={9}
        removeClippedSubviews={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING / 2,
          paddingBottom: 30,
        }}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  blackCard: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
