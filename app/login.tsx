import { loginUser } from "@/Redux/Slices/loginSlice";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const { width, height } = Dimensions.get("window");

 const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const login = () => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log("Login Form Values: ", values);
      dispatch(loginUser({ UserData: values, navigation }));
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/LogoImg.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text style={styles.head}>Welcome Back!</Text>
          <Text style={styles.text}>
            Let’s continue building a community where every 100rs counts.
          </Text>
        </View>

        {/* Email Field */}
        <View
          style={[
            styles.inputContainer,
            emailFocused && styles.inputContainerFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="rgba(3, 9, 96, 1)"
            onFocus={() => setEmailFocused(true)}
            onBlur={(e) => {
              setEmailFocused(false);
              handleBlur("email")(e);
            }}
            onChangeText={handleChange("email")}
            value={values.email}
          />
          <FontAwesome6 name="envelope" size={18} color="rgba(3, 9, 96, 1)" />
        </View>
        {touched.email && errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        {/* Password Field */}
        <View
          style={[
            styles.inputContainer,
            passwordFocused && styles.inputContainerFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="rgba(3, 9, 96, 1)"
            secureTextEntry={!passwordVisible}
            onFocus={() => setPasswordFocused(true)}
            onBlur={(e) => {
              setPasswordFocused(false);
              handleBlur("password")(e);
            }}
            onChangeText={handleChange("password")}
            value={values.password}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? (
              <Ionicons name="eye-outline" size={24} color="rgba(3, 9, 96, 1)" />
            ) : (
              <Ionicons name="eye-off-outline" size={24} color="rgba(3, 9, 96, 1)" />
            )}
          </TouchableOpacity>
        </View>
        {touched.password && errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        {/* Forgot Password */}
        <View style={styles.forgetTextWrapper}>
          <Text
            style={styles.forgetText}
            onPress={() => navigation.navigate("resetpassword")}
          >
            Forgot Password?
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Login</Text>
          <Feather style={styles.btnIcon} name="arrow-right" size={20} />
        </TouchableOpacity>

        {/* Sign Up */}
        <View style={styles.signUpContent}>
          <Text style={styles.accountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("signUp")}>
            <Text style={styles.signUpText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: width * 0.04, // 4% of screen width
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.08,
    marginBottom: height * 0.04,
  },
  logoImg: {
    width: width * 0.45,
    height: height * 0.09,
  },
  head: {
    color: "rgba(3, 9, 96, 1)",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 22,
  },
  text: {
    color: "rgba(3, 9, 96, 1)",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 22,
    marginTop: height * 0.015,
    marginBottom: height * 0.01,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(206, 240, 249, 1)",
    gap: width * 0.015,
    padding: width * 0.035,
    borderRadius: 8,
    marginTop: height * 0.03,
  },
  inputContainerFocused: {
    borderColor: "rgba(62, 180, 219, 1)",
    borderWidth: 2,
  },
  input: {
    width: width * 0.75,
    height: height * 0.05,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  forgetTextWrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: height * 0.015,
  },
  forgetText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "rgba(3, 9, 96, 0.5)",
  },
  loginBtn: {
    backgroundColor: "rgba(3, 9, 96, 1)",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: width * 0.02,
    borderRadius: 8,
    marginTop: height * 0.04,
  },
  btnText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
    color: "white",
  },
  btnIcon: {
    color: "white",
  },
  signUpContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: width * 0.02,
    marginTop: height * 0.02,
  },
  accountText: {
    color: "rgba(3, 9, 96, 1)",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
  },
  signUpText: {
    color: "rgba(38, 120, 185, 1)",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: 400,
    marginTop: 8,
  },
});

export default login;
