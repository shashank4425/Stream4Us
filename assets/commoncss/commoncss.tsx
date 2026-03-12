import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const commonStyles = StyleSheet.create({
  container: {
    backgroundColor: "#0D0E10",
    paddingHorizontal: 6,
    marginBottom:100
  },

  cards: {
    height: 160,
    width: windowWidth / 3.3,   // fixed width
    margin: 4,
    borderRadius: 5,
  },

  imgSize: {
    borderRadius: 6,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
});