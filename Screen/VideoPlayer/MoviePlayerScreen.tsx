import { FontAwesome } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import NetInfo from "@react-native-community/netinfo";
import * as NavigationBar from "expo-navigation-bar";
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

const MoviePlayer = ({ route }) => {
  const videoRef = useRef(null);
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

  const hideTimer = useRef(null);
  const movieLink = route.params;
  const videoSource = movieLink.seo ?
    require(`../../assets/video/bhojpuri/kalamchaba-gaini.mp4`) : { uri: movieLink.url };


  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBehaviorAsync("overlay-swipe");
      NavigationBar.setPositionAsync("absolute");
    }
  }, []);

  useEffect(() => {

    const unsub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) setIsLoading(true);
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
        StatusBar.setHidden(true, "fade");
        await NavigationBar.setVisibilityAsync("hidden");
      });

    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );

      InteractionManager.runAfterInteractions(async () => {
        setOrientation("portrait");
        StatusBar.setHidden(false, "fade");
        await NavigationBar.setVisibilityAsync("visible");
      });
    }
  };
  useEffect(() => {
    const backHandle = BackHandler.addEventListener("hardwareBackPress", () => {
      if (orientation === "landscape") {
        toggleScreen();
        return true;
      }
      return false;
    });
    return () => backHandle.remove();
  }, [orientation]);

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
              ref={videoRef}
              source={videoSource}
              paused={!isPlaying}
              resizeMode="cover"
              repeat
              style={StyleSheet.absoluteFill}

              disableFocus={true}
              maxBitRate={2500000}

              bufferConfig={{
                minBufferMs: 20000,
                maxBufferMs: 60000,
                bufferForPlaybackMs: 3000,
                bufferForPlaybackAfterRebufferMs: 5000,
              }}

              onLoadStart={() => {
                setIsLoading(true);
                setVideoLoaded(false);
              }}

              onLoad={(data) => {
                setDuration(data.duration);
                setIsLoading(false);
                setVideoLoaded(true);
                setIsPlaying(true);
                setPlayerReady(true);
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

                  {/* Movie Title - Flex 1 makes it take available space */}
                  <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <Text style={styles.lsTitleText} numberOfLines={1}>
                      {movieLink.seo ? movieLink.seo.page : movieLink.name}
                    </Text>
                  </View>

                  {/* Lock Icon - Now on the right side */}
                  <TouchableOpacity
                    style={{ padding: 0, zIndex: 20 }}
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
                  {!isLoading && movieLink.seo && (
                    <TouchableOpacity onPress={moveVideoBack}>
                      <MaterialIcon name="replay-10" size={36} color="white" />
                    </TouchableOpacity>
                  )}
                  {!isLoading && movieLink.seo && (
                    <TouchableOpacity onPress={handlePlayPause}>
                      <MaterialIcon name={!isPlaying ? "play-circle-outline" : "pause-circle-outline"} size={60} color="white" />
                    </TouchableOpacity>
                  )}
                  {!isLoading && movieLink.seo && (
                    <TouchableOpacity onPress={moveVideoForward}>
                      <MaterialIcon name="forward-10" size={36} color="white" />
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

                {/* SLIDER */}
                {movieLink.seo && playerReady &&
                  <View style={orientation === "portrait" ? styles.sliderController : styles.lsSliderController}>
                    <Slider
                      value={currentTime}
                      minimumValue={0}
                      maximumValue={duration}
                      minimumTrackTintColor="#b41313ff"
                      maximumTrackTintColor="#b6b3b3ff"
                      thumbTintColor="#b41313ff"
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
                  </View>}
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
    bottom: 0,
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
    paddingTop: 30,
    paddingBottom: 30,
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
    width: "100%",
    height: 200,
  },
  lsControle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    left: 10,
    right: 10,
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