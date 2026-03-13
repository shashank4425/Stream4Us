import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "Poppins-Light": require("../../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),

    "Roboto-Light": require("../../../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Medium": require("../../../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("../../../assets/fonts/Roboto-Bold.ttf"),

    "Lato-Light": require("../../../assets/fonts/Lato-Light.ttf"),
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
    "Lato-Thin": require("../../../assets/fonts/Lato-Thin.ttf"),
  });
};