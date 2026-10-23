import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

// Get device width and height
const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Center Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/LogoImg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('signUp')} style={styles.signUpBtn}>
          <Text style={styles.btnText}>Signup</Text>
          <Feather style={styles.btnIcon} name="arrow-right" size={20} />
        </TouchableOpacity>
{/* 
        <TouchableOpacity onPress={() => navigation.navigate('(tabs)')}>
          <Text style={{ color: "white" }}>Just to go to next Screen</Text>
        </TouchableOpacity> */}

        <View style={styles.loginContent}>
          <Text style={styles.accountText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(3, 9, 96, 1)",
    paddingHorizontal: width * 0.05, // 5% padding from sides
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.7, // 70% of screen width
    height: height * 0.15, // 15% of screen height
  },
  bottomContainer: {
    marginBottom: height * 0.05, // 5% of screen height
    alignItems: "center",
    gap: 20,
  },
  signUpBtn: {
    backgroundColor: "white",
    paddingVertical: 14, // dynamic padding based on height
    paddingHorizontal: 85, // dynamic padding based on width
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 8,
  },
  btnText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
    color: "rgba(17, 64, 140, 1)",
  },
  btnIcon: {
    color: "rgba(17, 64, 140, 1)",
  },
  loginContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accountText: {
    color: "white",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
  },
  loginText: {
    color: "rgba(38, 120, 185, 1)",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SplashScreen;
