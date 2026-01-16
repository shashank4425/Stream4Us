import { Dimensions, StyleSheet } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const nointernetStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#0D0E10",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",  // 🔑 SAME padding for everything
  },

  modalContainer: {
    height: 460,   // 🔥 increase here (0.8 = 80%)
    backgroundColor: "#0D0E10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 36,
  },


  content: {
    width: "100%", // 🔑 forces same left/right edges
    alignItems: "center",
    paddingHorizontal: 60
  },
  rocket: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 0,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    color: "#9A9A9A",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },

  button: {
    width: "100%", // 🔑 aligns with text width
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#16181C",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  backOnline: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 2,
    paddingBottom: 6,
    backgroundColor: "#1DB954",
    alignItems: "center"
  },

  backOnlineText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  }
});
