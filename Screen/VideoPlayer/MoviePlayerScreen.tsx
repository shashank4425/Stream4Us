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
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

  const hideTimer = useRef(null);
  const movieLink = route.params;
  const videoSource = require(`../../assets/video/bhojpuri/kalamchaba-gaini.mp4`);

  // --- ANDROID SYSTEM BAR INITIAL CONFIG ---
  useEffect(() => {
    const setupAndroidBars = async () => {
      // Prevents resizing when system bars appear
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    setupAndroidBars();

    const unsub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) setIsLoading(true);
    });
    return unsub;
  }, []);

  
  useEffect(() => {
    const setupImmersiveMode = async () => {
    await NavigationBar.setBehaviorAsync("overlay-swipe");
    await NavigationBar.setBackgroundColorAsync("#0D0E10"); 
  };
  setupImmersiveMode();

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
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    setOrientation("landscape");
    
    // Set these IMMEDIATELY to prevent the resize jump
    await NavigationBar.setBehaviorAsync("overlay-swipe");
    await NavigationBar.setVisibilityAsync("hidden");
    StatusBar.setHidden(true);
  } else {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    setOrientation("portrait");
    
    await NavigationBar.setVisibilityAsync("visible");
    await NavigationBar.setBehaviorAsync("inset-swipe"); // Standard for portrait
    StatusBar.setHidden(false);
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

  const videoStyle = StyleSheet.absoluteFillObject;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#0D0E10' }}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          hidden={orientation === "landscape"}
        />

        <View style={orientation === "portrait" ? {marginTop: StatusBar.currentHeight, height: 200 } 
          : { ...StyleSheet.absoluteFillObject, backgroundColor:"#0D0E10", zIndex: 1}}> 
          <Video
            ref={videoRef}
            source={videoSource}
            paused={!isPlaying}
            onLoadStart={() => { setIsLoading(true); setVideoLoaded(false); }}
            onLoad={(data) => {
              setDuration(data.duration);
              setIsLoading(false);
              setVideoLoaded(true);
              setIsPlaying(true);
            }}
            onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
            rate={playbackRate}
            // FIX 2: Only update currentTime if not seeking to prevent slider "fighting"
            onProgress={(data) => {
              if (!isSeeking) setCurrentTime(data.currentTime);
            }}
            onEnd={() => videoRef.current.seek(0)}
            // FIX 3: Use 'contain' in landscape to ensure the video isn't cut off by notches
            resizeMode="cover"
            repeat={true}
            style={videoStyle}
          />

          {/* TOUCHABLE OVERLAY */}
          <TouchableWithoutFeedback onPress={onVideoPress}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          {isLoading && (
            <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center", backgroundColor: "#0D0E10" }]}>
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
              <View style={{ flex: 1, justifyContent: "flex-start", alignItems:"flex-start" }}>
                <Text style={styles.lsTitleText} numberOfLines={1}>
                  {movieLink.seo.page}
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


          {/* MAIN CONTROLS */}
          {isConnected && !islockScreen && controlsVisible && (
            <View style={styles.controlsOverlay} pointerEvents="box-none">
              <View style={orientation === "portrait" ? styles.potraitControle : styles.lsControle}>
                {!isLoading && (
                  <TouchableOpacity onPress={moveVideoBack}>
                    <MaterialIcon name="replay-10" size={36} color="white" />
                  </TouchableOpacity>
                )}
                {!isLoading && (
                  <TouchableOpacity onPress={handlePlayPause}>
                    <MaterialIcon name={!isPlaying ? "play-circle-outline" : "pause-circle-outline"} size={60} color="white" />
                  </TouchableOpacity>
                )}
                {!isLoading && (
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
                  {orientation === "landscape" && (
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
              </View>
            </View>
          )}
        </View>

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

        {/* DESCRIPTION AREA */}
        {/* FIX 4: Wrap in ScrollView. In portrait, if the navigation bar appears, 
          the ScrollView ensures the text is still reachable and doesn't "cut off" */}
        {orientation === "portrait" && !isSwitching && (
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.contentMain}>
                <Text style={styles.mtitle}>{movieLink.seo.page}</Text>
                <Text style={styles.mline}>{movieLink.line2}</Text>
                <Text style={styles.contentDes}>{movieLink.seo.description}</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );

};

const styles = StyleSheet.create({
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
    height: 70, // Increased height for better touch area
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Darker overlay for text visibility
    paddingHorizontal: 10,
    zIndex: 50,
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