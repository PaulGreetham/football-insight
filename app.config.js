require('dotenv').config();

export default {
  expo: {
    name: "Football Insight",
    slug: "football-insight",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    platforms: ["ios", "android"],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.paulgreetham.footballinsight"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.paulgreetham.footballinsight"
    },
    plugins: ["expo-router"],
    scheme: "football-insight",
    experiments: {
      typedRoutes: true
    },
    extra: {
      EXPO_GNEWS_API_KEY: process.env.EXPO_GNEWS_API_KEY,
    }
  }
}; 