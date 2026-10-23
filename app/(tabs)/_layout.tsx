import { Tabs, useSegments } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const segments = useSegments();
  const currentPath = segments[0];
  console.log("currentPath1", currentPath);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#0A8FEF',
        tabBarInactiveTintColor: '#68687A',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingVertical: 10,
          borderColor: "transparent",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 85,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -5 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            },
            android: {
              elevation: 5,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="home" size={24} color={color} />
              {focused && <View style={styles.activeTab} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          tabBarLabel: '',
       
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="bar-chart" size={24} color={color} />
              {focused && <View style={styles.activeTab} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ScanQr"
        options={{
          tabBarLabel: '',
       
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="minimize" size={24} color={color} />
              {focused && <View style={styles.activeTab} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="settings-outline" size={24} color={color} />
              {focused && <View style={styles.activeTab} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position:"absolute",
    top:20,
  },
  activeTab: {
    backgroundColor: '#0A8FEF',
  },
});
