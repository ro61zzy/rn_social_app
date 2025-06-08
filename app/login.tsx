import { useLoginMutation } from "@/server/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LogIn = () => {
  const [userHandle, setUserHandle] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await login({
        user_handle: userHandle,
        password: password,
      }).unwrap();

      await AsyncStorage.setItem("accessToken", response.authToken);
      await AsyncStorage.setItem("userHandle", userHandle);

      router.replace("/home");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid user handle or password.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <TextInput
          placeholder="User @"
          placeholderTextColor="#999797"
          value={userHandle}
          onChangeText={setUserHandle}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999797"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={{ color: "#fff" }}>
            {isLoading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>
        {error && (
          <Text style={{ color: "red", marginTop: 10 }}>Login failed.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  box: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4b006e",
    padding: 8,
    borderRadius: 8,
  },
});
