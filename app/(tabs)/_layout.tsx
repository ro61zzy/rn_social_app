import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../../server/store";

export default function TabsLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
    tabBarStyle: {
      height: 65,           
      paddingBottom: 5,    
      paddingTop: 5,
    },
    tabBarLabelStyle: {
      fontSize: 12,         
    },
  }}

      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            headerShown: false,
            title: "User",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
