import { API_ENDPOINTS } from "@/constants/Project.Api";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

export default function OtpVerification() {
  const [Email, setEmail] = useState(""); // State for email input
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array for OTP digits]
  const [isLoading , setIsLoading] = useState(false); // State for loading indicator
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute(); // Access the route object // Destructure the email from route params
  const {email} = route.params; // Destructure the email from route params
  console.log(email);
  const handleVerifyOtp = async() => {
    const fullOtp = otp.join(""); // Join the OTP digits into a single string
    console.log(fullOtp);


    if (fullOtp.length === 6) {
      // API call to verify OTP
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.post(API_ENDPOINTS.Otp,{
          email: route?.params?.email,
          otp: fullOtp,
        },{
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (response.status === 200) {
          setIsLoading(false); // Set loading state to false
          Toast.show({
            type: 'success',
            text1: 'OTP Verified',
            text2: 'Your OTP has been verified successfully.',
          })
          Alert.alert("OTP Verified", "Your OTP has been verified successfully.");
          navigation.replace('login' , {email})
        }
        
      } catch (error) {
        setIsLoading(false); // Set loading state to false
        console.error("Error verifying OTP:", error);
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: error.response?.data?.message || 'An error occurred during OTP verification.',
        })
        Alert.alert("Verification Failed", "Please check your OTP and try again.");
        
      }
    
    } else {
      Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.");
    }
  };



  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;  // Update only the digit at the specific index
    setOtp(newOtp);  // Set the updated OTP array
    console.log(newOtp);

    // Automatically focus the next input field if the current field has a value
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }

  };

  const handleKeyPress = (e, index) => {
    // If backspace is pressed and the current input is empty, focus on the previous input field
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        // Show the loading spinner while the API call is in progress
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>Enter your email address below:</Text>

          <TextInput
            style={styles.emailInput}
            placeholder={route.params.email}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            editable={false} // Disable editing
          />

          <Text style={styles.subtitle}>We just sent a 6-digit code, enter below:</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[styles.input, digit && styles.inputFilled]} // Conditional styling when OTP digit is filled
                keyboardType="numeric"
                maxLength={1}
                value={digit} // Use the value from the OTP array for each input
                onChangeText={(text) => handleOtpChange(text, index)} // Update OTP array on change
                returnKeyType="next"
                onSubmitEditing={() => {
                  // Automatically focus next field if Enter/Return is pressed
                  if (index < otp.length - 1) {
                    inputs.current[index + 1]?.focus();
                  }
                }}
                onKeyPress={(e) => handleKeyPress(e, index)} // Handle backspace key press
              />
            ))}
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Wrong email?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("resendOtp")}>
              <Text style={styles.linkButton}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  otpContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 20,
    color: "#000",
  },
  inputFilled: {
    borderColor: "rgba(3, 9, 96, 1)", // purple outline when filled
    borderWidth: 2,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
  linkButton: {
    fontSize: 14,
    color: "#a855f7",
    fontWeight: "bold",
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
