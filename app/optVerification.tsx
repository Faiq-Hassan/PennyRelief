import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function otpVerification() {
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      Alert.alert("OTP Verified", `Your OTP: ${otp}`);
    } else {
      Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Identity</Text>
      <Text style={styles.subtitle}>
        We have sent a 6-digit verification code to your registered phone number. 
        Please enter the code below to proceed.
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
