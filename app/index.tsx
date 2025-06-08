import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../server/store";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Easing,
  ActivityIndicator,
} from "react-native";
import LogIn from "./login";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        delay: 2000,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start(() => setShowWelcome(false));
  }, []);

  return (
    <Provider store={store}>
      {showWelcome ? (
        <View style={styles.container}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.emoji}>🛸</Text>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Connecting minds...</Text>
            <ActivityIndicator size="small" color="#6b21a8" style={{ marginTop: 20 }} />
          </Animated.View>
        </View>
      ) : (
        <LogIn />
      )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", 
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6b21a8",
    marginTop: 10,
     textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
});
