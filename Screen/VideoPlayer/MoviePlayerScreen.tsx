import { FontAwesome } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import NetInfo from "@react-native-community/netinfo";
import * as ScreenOrientation from "expo-screen-orientation";
import throttle from "lodash.throttle";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Video from "react-native-video";
const windowWidth = Dimensions.get("window").width;

const MoviePlayer = ({ navigation, route }) => {
  const videoRef = useRef(null);
  const [maxBitrate, setMaxBitrate] = useState(2500000);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [islockScreen, setIsLockScreen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const [controlsVisible, setControlsVisible] = useState(false);
  const [speedMenuVisible, setSpeedMenuVisible] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoRatio, setVideoRatio] = useState(null);

  const hideTimer = useRef(null);
  const movieLink = route.params;
  //const videoSource = movieLink.seo ?
  //  require(`../../assets/video/bhojpuri/kalamchaba-gaini.mp4`) : { uri: movieLink.url };

  const videoSource = movieLink?.seo
    ? movieLink.seo.ogVideo && movieLink.seo.ogVideo.trim() !== ""
      ? { uri: movieLink.seo.ogVideo } // remote video
      : require("../../assets/video/bhojpuri/kalamchaba-gaini.mp4")
    : { uri: movieLink.url };


  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        setIsLoading(true);
        return;
      }

      if (state.type === "wifi") {
        setMaxBitrate(5000000); // 5 Mbps
      } else if (state.type === "cellular") {
        const gen = state.details?.cellularGeneration;

        if (gen === "2g") {
          setMaxBitrate(500000);
        } else if (gen === "3g") {
          setMaxBitrate(1200000);
        } else if (gen === "4g") {
          setMaxBitrate(2500000);
        } else if (gen === "5g") {
          setMaxBitrate(6000000);
        } else {
          setMaxBitrate(2000000);
        }
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    setIsLoading(!(videoLoaded && !buffering));
  }, [videoLoaded, buffering]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const moveVideoBack = () => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current.seek(newTime);
  };

  const moveVideoForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current.seek(newTime);
  };

  const throttledSeek = throttle((time) => {
    if (videoRef.current) videoRef.current.seek(time, 0);
  }, 200);

  const toggleScreen = async () => {
    if (orientation === "portrait") {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );

      InteractionManager.runAfterInteractions(async () => {
        setOrientation("landscape");
      });

    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );

      InteractionManager.runAfterInteractions(async () => {
        setOrientation("portrait");
      });
    }
  };
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, []);

  useEffect(() => {
    const backHandle = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {

        // If landscape → just rotate to portrait
        if (orientation === "landscape") {
          toggleScreen();
          return true; // handled by JS
        }

        // If portrait AND video is playing → allow native PiP
        if (orientation === "portrait" && isPlaying) {
          return false;
          // Returning false lets Android call onBackPressed()
          // which enters PiP
        }
        return false;
      }
    );
    return () => backHandle.remove();
  }, [orientation, isPlaying]);


  const startHideTimer = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setControlsVisible(false);
      setSpeedMenuVisible(false);
    }, 4000);
  };

  const onVideoPress = () => {
    setControlsVisible(!controlsVisible);
    if (!controlsVisible) startHideTimer();
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const lockScreen = () => {
    setIsLockScreen(!islockScreen);
    setControlsVisible(islockScreen);
  };

  //const videoMode = movieLink.seo ? "contain" : "cover";

  return (
    <>
      <View style={styles.root}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
        />
        <View style={styles.fullscreenWrapper}>
          <View
            style={[
              styles.videoBox,
              orientation === "portrait"
                ? styles.portraitVideoBox
                : styles.landscapeFullscreen
            ]}>
            <Video
              useTextureView={true}
              controls={false}
              ref={videoRef}
              source={videoSource}
              paused={!isPlaying}
              resizeMode="cover"
              disableFocus={true}
              hideShutterView={true}
              ignoreSilentSwitch="ignore"
              mixWithOthers="inherit"
              playInBackground={true}
              playWhenInactive={true}
              repeat

              onLoad={(data) => {
                setDuration(data.duration);
                setIsLoading(false);
                setVideoLoaded(true);
                setIsPlaying(true);
                setPlayerReady(true);
              }}
              style={StyleSheet.absoluteFill}
              maxBitRate={maxBitrate}
              bufferConfig={{
                minBufferMs: 5000,
                maxBufferMs: 20000,
                bufferForPlaybackMs: 1000,
                bufferForPlaybackAfterRebufferMs: 2000,
              }}
              onLoadStart={() => {
                setIsLoading(true);
                setVideoLoaded(false);
              }}
              onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
              rate={playbackRate}
              onProgress={(data) => {
                if (!isSeeking) setCurrentTime(data.currentTime);
              }}
              onEnd={() => videoRef.current?.seek(0)}
              onError={(e) => console.log("Video error", e)}
            />
            <Pressable
              onPress={onVideoPress}
              style={[
                StyleSheet.absoluteFillObject,
                { zIndex: 5, elevation: 5 }
              ]}
            />
            {(isLoading || buffering) && (
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(13,14,16,0.35)",
                  },
                ]}
              >
                <ActivityIndicator size="large" color="red" />
              </View>
            )}


            {/* LANDSCAPE HEADER */}
            {controlsVisible && orientation === "landscape" && (
              <View style={styles.lsTopVideoContainer}>
                <View style={styles.screenLockUnlock}>
                  {!islockScreen && (<TouchableOpacity
                    style={{ paddingRight: 15, zIndex: 20 }}
                    onPress={toggleScreen}
                  >
                    <FontAwesome name="angle-left" size={30} color="#fff" />
                  </TouchableOpacity>)}

                  <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <Text style={styles.lsTitleText} numberOfLines={1}>
                      {movieLink.seo ? movieLink.seo.page : movieLink.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{ position: "absolute", zIndex: 20 }}
                    onPress={lockScreen}
                  >
                    <MaterialIcon
                      name={islockScreen ? "lock" : "lock-open"}
                      size={30}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {playerReady && isConnected && !islockScreen && controlsVisible && (
              <View style={[
                styles.controlsOverlay, { paddingBottom: Platform.OS === "android" ? 40 : 0 }]}>
                <View style={orientation === "portrait" ? styles.potraitControle : styles.lsControle}>
                  {!isLoading && (
                    <TouchableOpacity onPress={moveVideoBack}>
                      <MaterialIcon name="replay-10" size={32} color="white" />
                    </TouchableOpacity>
                  )}
                  {!isLoading && (
                    <TouchableOpacity onPress={handlePlayPause}>
                      <MaterialIcon name={!isPlaying ? "play-circle-outline" : "pause-circle-outline"} size={52} color="white" />
                    </TouchableOpacity>
                  )}
                  {!isLoading && (
                    <TouchableOpacity onPress={moveVideoForward}>
                      <MaterialIcon name="forward-10" size={32} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* BOTTOM STRIP (Time + Fullscreen) */}
                <View style={orientation === "portrait" ? styles.bottomController : styles.lsbottomController}>
                  <Text style={styles.lsDurationTxt}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {orientation === "landscape" && movieLink.seo && (
                      <TouchableOpacity onPress={() => setSpeedMenuVisible(!speedMenuVisible)} style={{ marginRight: 15 }}>
                        <MaterialIcon name="speed" size={28} color="white" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={toggleScreen}>
                      <MaterialIcon style={styles.fsRotate} name={orientation === "portrait" ? "fullscreen" : "fullscreen-exit"} size={36} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {movieLink.seo && (
                  <View style={orientation === "portrait" ? styles.sliderController : styles.lsSliderController}>
                    <Slider
                      value={currentTime}
                      minimumValue={0}
                      maximumValue={duration}

                      minimumTrackTintColor="#b41313ff"
                      maximumTrackTintColor="#b6b3b3ff"

                      trackStyle={{ height: 3 }}
                      minimumTrackStyle={{ height: 3 }}
                      maximumTrackStyle={{ height: 3 }}

                      thumbStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#b41313ff",
                      }}

                      onSlidingStart={() => setIsSeeking(true)}
                      onValueChange={(val) => {
                        setCurrentTime(val[0]);
                        throttledSeek(val[0]);
                      }}
                      onSlidingComplete={(val) => {
                        setIsSeeking(false);
                        videoRef.current.seek(val[0]);
                      }}
                    />
                  </View>)}
              </View>
            )}
          </View>
          {orientation === "portrait" && !isSwitching && (
            <ScrollView style={{ flex: 1 }}>
              <View style={styles.container}>
                <View style={styles.contentMain}>
                  <Text style={styles.mtitle}>{movieLink.seo ? movieLink.seo.page : movieLink.name}</Text>
                  <Text style={styles.mline}>{movieLink.line2}</Text>
                  <Text style={styles.contentDes}>{movieLink.seo ? movieLink.seo.description : "No Description"}</Text>
                </View>
              </View>
            </ScrollView>
          )}
          {/* SPEED MENU POPUP */}
          {speedMenuVisible && (
            <View style={styles.speedMenuPopup}>
              {[1, 1.25, 1.5, 1.75, 2].map((rate) => (
                <TouchableOpacity
                  key={rate}
                  onPress={() => setPlaybackRate(rate)}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{
                    color: playbackRate === rate ? "yellow" : "white",
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: 'bold'
                  }}>
                    {rate}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </>
  );

};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0E10',
  },
  fullscreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  videoBox: {
    width: '100%',
    backgroundColor: '#0D0E10',
  },

  portraitVideoBox: {
    marginTop: StatusBar.currentHeight,
    aspectRatio: 16 / 9,
    width: '100%',
  },
  landscapeFullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },


  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: "center",
    zIndex: 10,
  },
  potraitControle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%"
  },
  lsControle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    gap: 100, // Keeps icons spread out in landscape
  },
  bottomController: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lsbottomController: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100
  },
  sliderController: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
  },
  lsSliderController: {
    position: "absolute",
    bottom: 10,
    left: 50,
    right: 50,
  },

  lsTopVideoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60, // Increased height for better touch area
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Darker overlay for text visibility
    paddingHorizontal: 10,
    zIndex: 100,
  },

  screenLockUnlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",   // icon goes to right end
    paddingHorizontal: 10,
    left: 50,
    right: 50,
    position: "absolute",         // needed for absolute center text
  },

  lsTitleText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  speedMenuPopup: {
    position: "absolute",
    // In landscape, we want it higher up so it doesn't block the slider
    bottom: 100,
    right: 40,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 12,
    width: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 100, // Important for Android
    elevation: 10,
  },


  centerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: 'center'
  },
  container: {
    width: windowWidth,
    padding: 20,
  },
  contentMain: {
    textAlign: "center",
    justifyContent: "space-between",
  },
  mtitle: { color: "#FFF", fontWeight: "700", fontSize: 18 },
  mline: { color: "#dcdcdc", fontSize: 13, paddingVertical: 10 },
  contentDes: { color: "#dcdcdc", fontSize: 12, lineHeight: 18 },
  lsDurationTxt: { color: "white", backgroundColor: "rgba(0,0,0,0.5)", padding: 4, borderRadius: 5 }
});

export default MoviePlayer;