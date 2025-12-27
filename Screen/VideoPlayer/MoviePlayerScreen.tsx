import NetInfo from "@react-native-community/netinfo";
//import Slider from '@react-native-community/slider';
import { FontAwesome } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import * as NavigationBar from "expo-navigation-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import throttle from "lodash.throttle";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  NativeModules,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Video from "react-native-video";

const { ExpoPictureInPicture } = NativeModules;
const MoviePlayer = ({navigation, route }) => {
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

  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        setIsLoading(true); // Show loader if offline
      }
    });

    return unsub;
  }, []);

  // 🔥 Loader logic: Hide only when fully loaded AND not buffering
  useEffect(() => {
    if (videoLoaded && !buffering) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [videoLoaded, buffering]);

  const movieLink = route.params;
  const { videoLink } = route.params;
  const videoSource = require(`../../assets/video/bhojpuri/kalamchaba-gaini.mp4`)// Require the video

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const moveVideoBack = async () => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current.seek(newTime);
    setCurrentTime(newTime);
  }
  const moveVideoForward = async () => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current.seek(newTime);
    setCurrentTime(newTime);
  }
  const throttledSeek = throttle((time) => {
    if (videoRef.current) {
      videoRef.current.seek(time, 0);  // accurate seek
    }
  }, 200);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    const sub = AppState.addEventListener("change", state => {
      if (state === "active" && orientation === "landscape") {
        enableImmersive(); // re-hide navbar
      }
    });
    return () => sub.remove();
  }, [orientation]);
  const toggleScreen = async () => {
    try {
      if (orientation === "portrait") {
        setIsSwitching(true);

        // Lock orientation first
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );

        setOrientation("landscape");

        // Give Android time to rotate layout
        await new Promise(resolve => setTimeout(resolve, 300));

        // Hide system UI together
        if (Platform.OS === "android") {
          StatusBar.setHidden(true, "fade");
          await enableImmersive();
        }

      } else {
        setIsSwitching(false);

        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );

        setOrientation("portrait");

        if (Platform.OS === "android") {
          StatusBar.setHidden(false, "fade");
          await disableImmersive();
        }
      }
    } catch (e) {
      console.log("toggleScreen error:", e);
    }
  };

  const enableImmersive = async () => {
    try {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe"); // ✅ true immersive
      console.log("got")
    } catch (e) {
      console.log("enable immersive error:", e);
    }
  };

  const disableImmersive = async () => {
    try {
      await NavigationBar.setVisibilityAsync("visible");
      await NavigationBar.setBehaviorAsync("inset-swipe");
    } catch (e) {
      console.log("disable immersive error:", e);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setControlsVisible(false);
    }, 4000);
  }, []);

  const lockScreen = async () => {
    if (islockScreen == false) {
      setControlsVisible(false);
      setIsLockScreen(true)
    } else {
      setIsLockScreen(false);
      setControlsVisible(true);
    }
  }

  const startHideTimer = () => {
    // Clear previous timer
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    // Hide after 4 seconds
    hideTimer.current = setTimeout(() => {
      setControlsVisible(false);
      setSpeedMenuVisible(false);
    }, 4000);
  };

  const onVideoPress = () => {
    if (controlsVisible) {
      setControlsVisible(false);
    } else {
      setControlsVisible(true);
    }
    startHideTimer();
  };
  const selectSpeed = (speed) => {
    setPlaybackRate(speed);
    setSpeedMenuVisible(false);

  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={orientation === "landscape" ? styles.lsVideoView : undefined}>
          <Video
            ref={videoRef}
            source={videoSource}
            paused={!isPlaying}
            onLoadStart={() => {
              setIsLoading(true);
              setVideoLoaded(false);
            }}

            onLoad={(data) => {
              setDuration(data.duration);
              setIsLoading(false);
              setVideoLoaded(true);
              setIsPlaying(true);
            }}

            onBuffer={({ isBuffering }) => {
              setBuffering(isBuffering);
            }}
            rate={playbackRate}
            onProgress={(data) => setCurrentTime(data.currentTime)}

            onEnd={() => videoRef.current.seek(0)}

            resizeMode="cover"
            repeat={true}

            style={
              orientation === "portrait"
                ? { marginTop: 35, width: "100%", height: 200 }
                : StyleSheet.absoluteFillObject
            }
          />


          {isLoading && (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0D0E10",
                },
              ]}
            >
              <ActivityIndicator size="large" color="red" />
            </View>
          )}
          <TouchableWithoutFeedback onPress={onVideoPress}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
          {controlsVisible && orientation == "landscape" && (
            <View style={styles.screenLockUnlock}>
              <Text style={styles.centerText}>
                <TouchableOpacity style={{marginTop:12, paddingRight:20}} activeOpacity={1} onPress={toggleScreen}>
                  <FontAwesome name="angle-left" size={24} color="#fff"></FontAwesome>
              </TouchableOpacity>
               {movieLink.seo.page}
              </Text>
              <TouchableOpacity onPress={lockScreen}>
                <MaterialIcon
                  name={islockScreen ? "lock" : "lock-open"}
                  size={36}
                  color="white"
                />
              </TouchableOpacity>
            </View>

          )}

          {isConnected && !islockScreen && controlsVisible && (

            <View style={styles.controlsOverlay}>
              <View style={orientation == "portrait" ? styles.potraitControle : styles.lsControle}>
                {!isLoading &&
                  <TouchableOpacity onPress={moveVideoBack}>
                    <MaterialIcon name="replay-10" size={36} color="white"
                    ></MaterialIcon>
                  </TouchableOpacity>}
                {!isLoading && <TouchableOpacity onPress={handlePlayPause}>
                  <View>
                    <MaterialIcon
                      name={!isPlaying ? "play-circle-outline" : "pause-circle-outline"} size={60} color="white"
                    />
                  </View>
                </TouchableOpacity>}
                {!isLoading && <TouchableOpacity onPress={moveVideoForward}>
                  <MaterialIcon name="forward-10" size={36} color="white"
                  ></MaterialIcon>
                </TouchableOpacity>}
              </View>

              <View style={orientation == "portrait" ? styles.bottomController : styles.lsbottomController}>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "flex-start" }}>
                  <Text style={orientation == "portrait" ? styles.potraitDurationTxt : styles.lsDurationTxt}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>
                </View>
                {orientation == "landscape" && (
                  <TouchableOpacity
                    onPress={() => setSpeedMenuVisible(!speedMenuVisible)}
                    style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                    <MaterialIcon
                      name="speed"   // MATERIAL ICON SPEED SYMBOL
                      size={28}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
                <View style={orientation == "portrait" ? styles.potraitFullscreen : styles.lsFullscreen}>
                  <TouchableOpacity onPress={toggleScreen}>
                    <MaterialIcon style={styles.fsRotate} name={orientation == "portrait" ? "fullscreen" : "fullscreen-exit"} size={24} color="white"
                    ></MaterialIcon>
                  </TouchableOpacity>
                </View>


              </View>
              <View style={orientation == "portrait" ? styles.sliderController : styles.lsSliderController}>
                <Slider
                  value={currentTime}
                  minimumValue={0}
                  maximumValue={duration}
                  minimumTrackTintColor="#b41313ff"
                  maximumTrackTintColor="#b6b3b3ff"
                  thumbTintColor="#b41313ff"
                  trackStyle={{ height: 4 }}
                  thumbStyle={{ height: 12, width: 12, borderRadius: 6 }}

                  onSlidingStart={() => setIsSeeking(true)}

                  onValueChange={(valueArray) => {
                    const time = valueArray[0];  // extract number
                    setCurrentTime(time);
                    throttledSeek(time);
                  }}

                  onSlidingComplete={(valueArray) => {
                    const time = valueArray[0];  // extract number
                    setIsSeeking(false);
                    videoRef.current.seek(time);
                  }}
                />

              </View>
            </View>
          )}
        </View>
        {speedMenuVisible && (
          <View
            style={{
              position: "absolute",
              bottom: 80,
              right: 25,
              backgroundColor: "rgba(0,0,0,0.85)",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              width: 75
            }}
          >
            {[1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <TouchableOpacity
                key={rate}
                onPress={() => selectSpeed(rate)}
                style={{
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    color: playbackRate === rate ? "yellow" : "white",
                    fontSize: 16,
                    textAlign: "center"
                  }}
                >
                  {rate}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {orientation == "portrait" && (
          <View style={styles.container}>
            <View style={styles.contentMain}>
              <Text style={styles.mtitle}>{movieLink.seo.page}</Text>
              <Text style={styles.mline}>{movieLink.line2}</Text>
              <Text style={styles.contentDes}>{movieLink.seo.description}</Text>
            </View>
          </View>)}
      </View>

    </>
  )
};


const styles = StyleSheet.create({
  lsVideoView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },

  controlsOverlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },


  // CENTER CONTROLS
  potraitControle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "50%",
    paddingVertical: 30
  },

  lsControle: {
    position: "absolute",
    left: 300,
    right: 300,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // BOTTOM CONTROLS (time + fullscreen)
  bottomController: {
    position: "absolute",
    bottom: 40,
    left: 15,
    right: 15,
    marginBottom: -25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  lsbottomController: {
    position: "absolute",
    bottom: 50,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  potraitDurationTxt: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "auto",
    color: "white",
    textAlign: "center",
    padding: 5,
    borderRadius: 12,
    fontSize: 14,
  },
  lsDurationTxt: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "auto",
    color: "white",
    textAlign: "center",
    padding: 5,
    borderRadius: 12,
    fontSize: 14,
  },
  // SLIDER
  sliderController: {
    position: "absolute",
    bottom: 5,
    left: 10,
    right: 10,
    marginBottom: -25,
  },

  lsSliderController: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
  },

  screenLockUnlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",   // icon goes to right end
    paddingHorizontal: 10,
    height: 50,
    left: 30,
    right: 30,
    top: 20,
    position: "absolute",         // needed for absolute center text
  },

  centerText: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "left",
    fontSize: 22,
    fontWeight: 700,
    color: "#FFFFFF",
  },

  potraitFullscreen: {
    justifyContent: "flex-end",
    position: "relative"
  },
  lsFullscreen: {
    end: "auto"
  },

  fsRotate: {
    fontSize: 36,
    fontWeight: "100",
  },
  brightnesSlider: {
    top: "48%",
    position: "relative",
    width: 100,
    flexDirection: "row",
    transform: [{ rotate: '-90deg' }],
  },

  container: {
    height: "100%",
    width: "100%",
    padding: 20,
  },
  contentMain: {
    textAlign: "center",
    justifyContent: "space-between",
  },
  mtitle: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 18
  },
  mline: {
    color: "#dcdcdc",
    fontWeight: "700",
    fontSize: 13,
    paddingVertical: 10
  },
  contentDes: {
    color: "#dcdcdc",
    fontWeight: "700",
    fontSize: 10
  },
});

export default MoviePlayer;