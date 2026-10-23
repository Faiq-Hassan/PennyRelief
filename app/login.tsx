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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3fbf6" }}>
      <View style={styles.container}>
        {/* Brand Header */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/LogoImg.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <View style={styles.badgePill}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>PENNYRELIEF • STUDENT RELIEF</Text>
          </View>
        </View>

        <View style={styles.headerTextBox}>
          <Text style={styles.head}>Welcome Back</Text>
          <Text style={styles.text}>
            Every penny counts. Access your student relief wallet, track your loan status, and join our dignified community.
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
            placeholder="Student Email (e.g. student@nfc.edu.pk)"
            placeholderTextColor="#8aa89b"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={(e) => {
              setEmailFocused(false);
              handleBlur("email")(e);
            }}
            onChangeText={handleChange("email")}
            value={values.email}
          />
          <FontAwesome6 name="envelope" size={16} color={emailFocused ? "#072a1e" : "#8aa89b"} />
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
            placeholderTextColor="#8aa89b"
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
              <Ionicons name="eye-outline" size={20} color={passwordFocused ? "#072a1e" : "#8aa89b"} />
            ) : (
              <Ionicons name="eye-off-outline" size={20} color={passwordFocused ? "#072a1e" : "#8aa89b"} />
            )}
          </TouchableOpacity>
        </View>
        {touched.password && errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        {/* Forgot Password */}
        <View style={styles.forgetTextWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate("resetpassword")}>
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginBtn} 
          onPress={handleSubmit}
          activeOpacity={0.88}
        >
          <Text style={styles.btnText}>Sign In to Relief Portal</Text>
          <Feather style={styles.btnIcon} name="arrow-right" size={18} />
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContent}>
          <Text style={styles.accountText}>Need student financial aid?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("signUp")}>
            <Text style={styles.signUpText}>Apply / Register</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Badges Footer */}
        <View style={styles.trustFooter}>
          <Text style={styles.trustText}>
            ✓ 0% Interest  •  ✓ AI Need-Audited  •  ✓ 100% Dignified
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: width * 0.06,
    backgroundColor: "#f3fbf6",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  logoImg: {
    width: width * 0.28,
    height: height * 0.07,
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c1e8d5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#072a1e",
  },
  badgeText: {
    color: "#072a1e",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  headerTextBox: {
    marginBottom: height * 0.02,
  },
  head: {
    color: "#072a1e",
    fontWeight: "800",
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  text: {
    color: "#194f3b",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#d8ede1",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: height * 0.02,
    shadowColor: "#072a1e",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: "#34d399",
    backgroundColor: "#ffffff",
    shadowColor: "#34d399",
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    height: height * 0.04,
    fontSize: 15,
    color: "#072a1e",
    fontWeight: "500",
    paddingRight: 10,
  },
  forgetTextWrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 10,
  },
  forgetText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ff8f6b",
  },
  loginBtn: {
    backgroundColor: "#ff8f6b",
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    marginTop: height * 0.03,
    shadowColor: "#ff8f6b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  btnIcon: {
    color: "#ffffff",
  },
  signUpContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: height * 0.025,
  },
  accountText: {
    color: "#194f3b",
    fontWeight: "500",
    fontSize: 13,
  },
  signUpText: {
    color: "#072a1e",
    fontWeight: "700",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#e11d48",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 4,
  },
  trustFooter: {
    marginTop: height * 0.03,
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#d8ede1",
  },
  trustText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#5f8574",
    fontWeight: "600",
  },
});

export default login;
