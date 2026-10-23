// SignupScreen.js
import { API_ENDPOINTS } from "@/constants/Project.Api";
import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const { width, height } = Dimensions.get("window");

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Please enter email"),
  RegNo: Yup.string()
    .required("Registration number is required")
    .matches(
      /^[0-9]{4}-[a-z]{2,10}-[a-z]{2,10}-[a-z]{2,10}-[0-9]{2}$/i,
      "Invalid registration number format (e.g., 2021-nfc-fd-cs-29)"
    ),
  StudentName: Yup.string().required("Please enter student name"),
  phoneNo: Yup.string()
    .matches(/^\d+$/, "Must be only digits")
    .min(7, "Too short")
    .required("Please enter phone number"),
  password: Yup.string().min(6, "Too short").required("Please enter password"),
  Dept: Yup.string().required("Please enter department"),
  semester: Yup.string().required("Please enter semester"),
  cnic: Yup.string()
    .matches(/^\d+$/, "Must be only digits")
    .length(13, "CNIC must be 13 digits")
    .required("Please enter CNIC"),
  profileImage: Yup.string().required("Profile image is required"),
});

const initialValues = {
  email: "",
  RegNo: "",
  StudentName: "",
  phoneNo: "",
  password: "",
  Dept: "",
  semester: "",
  cnic: "",
  profileImage: "",
};

const SignupScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("RegNo", values.RegNo);
      formData.append("StudentName", values.StudentName);
      formData.append("phoneNo", values.phoneNo);
      formData.append("password", values.password);
      formData.append("Dept", values.Dept);
      formData.append("semester", values.semester);
      formData.append("cnic", values.cnic);
      formData.append("profileImage", {
        uri: values.profileImage,
        type: "image/jpeg",
        name: "profileImage.jpg",
      });

      setIsLoading(true);
      try {
        const response = await axios.post(API_ENDPOINTS.signup, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          navigation.navigate("otpVerification", { email: values.email });
        }
      } catch (error) {
        ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Media access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("profileImage", result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("profileImage", result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.head}>Join the 100’s rs Movement</Text>
              <Text style={styles.text}>
                Join the student-powered support system.
              </Text>

              <View style={styles.imageUploaderContainer}>
                {values.profileImage ? (
                  <Image
                    source={{ uri: values.profileImage }}
                    style={styles.profileImage}
                  />
                ) : null}
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handlePickImage}
                >
                  <Text style={styles.imageButtonText}>
                    Upload from Gallery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleTakePhoto}
                >
                  <Text style={styles.imageButtonText}>Take a Photo</Text>
                </TouchableOpacity>
                {touched.profileImage && errors.profileImage && (
                  <Text style={styles.errorText}>{errors.profileImage}</Text>
                )}
              </View>

              {[
                {
                  name: "email",
                  placeholder: "Enter Email",
                  icon: (
                    <FontAwesome6 name="envelope" size={18} color="#030960" />
                  ),
                },
                {
                  name: "RegNo",
                  placeholder: "Registration ID",
                  icon: (
                    <MaterialIcons
                      name="credit-card"
                      size={18}
                      color="#030960"
                    />
                  ),
                },
                { name: "StudentName", placeholder: "Full Name" },
                {
                  name: "phoneNo",
                  placeholder: "Phone Number",
                  icon: <Feather name="phone" size={18} color="#030960" />,
                },
                {
                  name: "Dept",
                  placeholder: "Department",
                  icon: (
                    <Ionicons
                      name="school-outline"
                      size={18}
                      color="rgba(3,9,96,1)"
                    />
                  ),
                },
                {
                  name: "semester",
                  placeholder: "Semester",
                  icon: (
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="rgba(3,9,96,1)"
                    />
                  ),
                },
                {
                  name: "cnic",
                  placeholder: "CNIC (13 digits)",
                  icon: (
                    <Ionicons
                      name="id-card-outline"
                      size={18}
                      color="rgba(3,9,96,1)"
                    />
                  ),
                },
              ].map(({ name, placeholder, icon }) => (
                <View key={name}>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === name && styles.inputContainerFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder={placeholder}
                      placeholderTextColor="#030960"
                      onFocus={() => setFocusedField(name)}
                      onBlur={handleBlur(name)}
                      onChangeText={handleChange(name)}
                      value={values[name]}
                      keyboardType={
                        ["phoneNo", "cnic"].includes(name)
                          ? "numeric"
                          : "default"
                      }
                    />
                    {icon}
                  </View>
                  {touched[name] && errors[name] && (
                    <Text style={styles.errorText}>{errors[name]}</Text>
                  )}
                </View>
              ))}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#030960"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={!passwordVisible}
                />
                <Feather
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={18}
                  color="#030960"
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Sign Up</Text>
                <Feather style={styles.btnIcon} name="arrow-right" size={20} />
              </TouchableOpacity>

              {/* Login Redirection */}
              <View style={styles.signUpContent}>
                <Text style={styles.accountText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("login")}>
                  <Text style={styles.signUpText}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: width * 0.04,
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  logoImg: {
    width: width * 0.45,
    height: height * 0.1,
  },
  head: {
    color: "rgba(3,9,96,1)",
    fontWeight: "600",
    fontSize: height * 0.03,
    lineHeight: 22,
  },
  text: {
    color: "rgba(3,9,96,1)",
    fontWeight: "400",
    fontSize: height * 0.02,
    lineHeight: 22,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  imageUploaderContainer: {
    alignItems: "center",
    marginTop: height * 0.03,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "rgba(3,9,96,1)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 8,
    marginTop: height * 0.02,
  },
  imageButtonText: {
    color: "white",
    fontSize: height * 0.02,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(206,240,249,1)",
    gap: 6,
    padding: width * 0.03,
    borderRadius: 8,
    marginTop: height * 0.03,
  },
  inputContainerFocused: {
    borderColor: "rgba(62,180,219,1)",
    borderWidth: 2,
  },
  input: {
    width: width * 0.75,
    fontSize: height * 0.02,
    color: "black",
  },
  loginBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(3,9,96,1)",
    padding: height * 0.02,
    marginTop: height * 0.05,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontSize: height * 0.022,
    fontWeight: "bold",
  },
  btnIcon: {
    marginLeft: 10,
    color: "white",
  },
  signUpContent: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.02,
  },
  accountText: {
    fontSize: height * 0.02,
    color: "rgba(3,9,96,1)",
  },
  signUpText: {
    marginLeft: 5,
    fontSize: height * 0.02,
    fontWeight: "bold",
    color: "rgba(3,9,96,1)",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: 400,
    marginTop: 8,
  },
});
