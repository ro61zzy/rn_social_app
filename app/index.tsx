import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../server/store";
import { View, Text, Animated, StyleSheet } from "react-native";
import LogIn from "./login";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeOutAnim = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      delay: 2500,
      useNativeDriver: true,
    });

    fadeOutAnim.start(() => setShowWelcome(false));

    return () => fadeOutAnim.stop();
  }, []);

  return (
    <Provider store={store}>
      {showWelcome ? (
        <View style={styles.container}>
          <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
            Welcome to this Social App
          </Animated.Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color:"grey"
  },
});
