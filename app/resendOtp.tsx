import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function ResendOtp({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendOtp = () => {
    if (!email.trim()) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Normally here you would call your API to send OTP to the entered email.
    // For now, we just simulate and navigate to OTP Verification Screen.

    Alert.alert("OTP Sent", `An OTP has been sent to ${email}`);
    navigation.navigate("OtpVerification");  // Navigate to OTP screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your Email to receive OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(3, 9, 96, 1)",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
