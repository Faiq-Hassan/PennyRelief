import { API_ENDPOINTS } from "@/constants/Project.Api";
import { Feather, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PersonalInfoScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [isLoading, setIsLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    registrationNo: "",
    email: "",
    studentName: "",
    department: "",
    semester: "",
    cgpa: "",
    loanAmount: "",
    phoneNumber: "",
    cnicFrontUri: null,
    cnicBackUri: null,
    fatherName: "",
    fatherOccupation: "",
    fatherSalary: "",
    siblings: "",
    additionalNotes: "",
    electricityBillUri: null,
    gasBillUri: null,
    waterBillUri: null,
  });

  // Error states
  const [errors, setErrors] = useState({
    registrationNo: "",
    email: "",
    studentName: "",
    department: "",
    semester: "",
    cgpa: "",
    loanAmount: "",
    phoneNumber: "",
    cnicFrontUri: "",
    cnicBackUri: "",
    fatherName: "",
    fatherOccupation: "",
    fatherSalary: "",
    siblings: "",
    electricityBillUri: "",
    gasBillUri: "",
    waterBillUri: "",
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  // Image Picker Function
  const pickImage = async (field) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to your media library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleInputChange(field, result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Camera Function
  const takePhoto = async (field) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to your camera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleInputChange(field, result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  // Validation functions
 const validateRegistrationNo = (value) => {
  if (!value.trim()) return "Registration number is required";

  // Validate pattern: 2021-nfc-fd-cs-29
const pattern = /^[0-9]{4}-[a-z]{2,10}-[a-z]{2,10}-[a-z]{2,10}-[0-9]{2,3}$/i;


  if (!pattern.test(value.trim())) return "Invalid registration number format (e.g., year-your registeration code (e.g. nfc-fd-cs -RollNo)";
  
  return "";
};


  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Please enter a valid email";
    return "";
  };

  const validateName = (name, fieldName) => {
    if (!name.trim()) return `${fieldName} is required`;
    if (!/^[A-Za-z\s]+$/.test(name)) return `${fieldName} should only contain letters`;
    return "";
  };

  const validateSemester = (semester) => {
    if (!semester.trim()) return "Semester is required";
    const sem = parseInt(semester);
    if (isNaN(sem) || sem < 0 || sem > 7) return "Please enter a valid semester (0-7)";
    return "";
  };

  const validateCGPA = (cgpa) => {
    if (!cgpa.trim()) return "CGPA is required";
    const cgpaValue = parseFloat(cgpa);
    if (isNaN(cgpaValue)) return "CGPA must be a number";
    if (cgpaValue < 0 || cgpaValue > 4) return "Please enter a valid CGPA (0-4)";
    return "";
  };

  const validateAmount = (amount, fieldName) => {
    if (!amount.trim()) return `${fieldName} is required`;
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) return `${fieldName} must be a number`;
    if (amountValue < 0) return `${fieldName} cannot be negative`;
    return "";
  };

  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    const re = /^[0-9]{10,15}$/;
    if (!re.test(phone)) return "Please enter a valid phone number (10-15 digits)";
    return "";
  };

  const validateImage = (uri, fieldName) => {
    if (!uri) return `${fieldName} is required`;
    return "";
  };

  const validateSiblings = (siblings) => {
    if (!siblings.trim()) return "Number of siblings is required";
    const siblingsValue = parseInt(siblings);
    if (isNaN(siblingsValue)) return "Please enter a valid number";
    if (siblingsValue < 0) return "Number cannot be negative";
    return "";
  };

  // Validate current page
  const validateCurrentPage = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (currentPage === 1) {
      newErrors.registrationNo = validateRegistrationNo(formData.registrationNo);
      newErrors.email = validateEmail(formData.email);
      newErrors.studentName = validateName(formData.studentName, "Student name");
      newErrors.department = formData.department.trim() ? "" : "Department is required";
      newErrors.semester = validateSemester(formData.semester);
      newErrors.cgpa = validateCGPA(formData.cgpa);
      newErrors.loanAmount = validateAmount(formData.loanAmount, "Loan amount");
      newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
      newErrors.cnicFrontUri = validateImage(formData.cnicFrontUri, "CNIC front image");
      newErrors.cnicBackUri = validateImage(formData.cnicBackUri, "CNIC back image");
    } 
    else if (currentPage === 2) {
      newErrors.fatherName = validateName(formData.fatherName, "Father name");
      newErrors.fatherOccupation = formData.fatherOccupation.trim() ? "" : "Father occupation is required";
      newErrors.fatherSalary = validateAmount(formData.fatherSalary, "Father salary");
      newErrors.siblings = validateSiblings(formData.siblings);
    } 
    else if (currentPage === 3) {
      newErrors.electricityBillUri = validateImage(formData.electricityBillUri, "Electricity bill");
      newErrors.gasBillUri = validateImage(formData.gasBillUri, "Gas bill");
      newErrors.waterBillUri = validateImage(formData.waterBillUri, "Water bill");
    }

    setErrors(newErrors);

    // Check if any errors exist
    isValid = !Object.values(newErrors).some(error => error !== "");

    // Show first error message if any
    if (!isValid) {
      const firstError = Object.values(newErrors).find(error => error !== "");
      if (firstError) {
        Alert.alert("Validation Error", firstError);
      }
    }

    return isValid;
  };

  // Navigation functions
  const nextPage = () => {
    if (validateCurrentPage()) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Check if current page is complete
  const isCurrentPageComplete = () => {
    if (currentPage === 1) {
      return !validateRegistrationNo(formData.registrationNo) &&
             !validateEmail(formData.email) &&
             !validateName(formData.studentName, "Student name") &&
             formData.department.trim() &&
             !validateSemester(formData.semester) &&
             !validateCGPA(formData.cgpa) &&
             !validateAmount(formData.loanAmount, "Loan amount") &&
             !validatePhoneNumber(formData.phoneNumber) &&
             formData.cnicFrontUri &&
             formData.cnicBackUri;
    } else if (currentPage === 2) {
      return !validateName(formData.fatherName, "Father name") &&
             formData.fatherOccupation.trim() &&
             !validateAmount(formData.fatherSalary, "Father salary") &&
             !validateSiblings(formData.siblings);
    } else if (currentPage === 3) {
      return formData.electricityBillUri &&
             formData.gasBillUri &&
             formData.waterBillUri;
    }
    return false;
  };

const handleSubmit = async () => {
  if (!validateCurrentPage()) return;

  setIsLoading(true);

  try {
    const data = new FormData();

    // ✅ Assume this is your state
    const f = formData; // use your actual state variable name

    // Helper: Append non-file fields
    const appendField = (key, value) => {
      if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    };

    // Append text fields
    appendField('email', f.email);
    appendField('phoneNo', f.phoneNumber);
    appendField('studentName', f.studentName);
    appendField('regNo', f.registrationNo);
    appendField('semester', f.semester);
    appendField('cgpa', f.cgpa);
    appendField('dept', f.department);
    appendField('loanAmount', f.loanAmount);
    appendField('loanPurpose', 'Education');
    appendField('fatherName', f.fatherName);
    appendField('fatherOccupation', f.fatherOccupation);
    appendField('fatherSalary', f.fatherSalary);
    appendField('siblings', f.siblings);
    appendField('additionalNotes', f.additionalNotes || '');

    // Helper: Append image files
    const appendImage = async (uri, fieldName) => {
      if (uri) {
        const filename = uri.split('/').pop();
        const ext = /\.(\w+)$/.exec(filename || '');
        const type = ext ? `image/${ext[1]}` : 'image';

        const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');

        data.append(fieldName, {
          uri: fileUri,
          name: filename,
          type: type,
        });
      }
    };

    // Append images
    await Promise.all([
      appendImage(f.cnicFrontUri, 'cnicFrontImage'),
      appendImage(f.cnicBackUri, 'cnicBackImage'),
      appendImage(f.electricityBillUri, 'electricityBillImage'),
      appendImage(f.gasBillUri, 'gasBillImage'),
      appendImage(f.waterBillUri, 'waterBillImage'),
    ]);

    // Authorization
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token not found');

    // Log for debug
    const logObj = {};
    data._parts.forEach(([key, value]) => {
      logObj[key] = value instanceof Object ? '[FILE]' : value;
    });
    console.log('FormData being sent:', logObj);

    // Send request
    const response = await axios.post(API_ENDPOINTS.application, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      transformRequest: (d) => d,
    });

    // Success
    if (response.status === 200 || response.status === 201) {
      Alert.alert('Success', 'Loan application submitted successfully!');

      setFormData({
        registrationNo: '',
        email: '',
        studentName: '',
        department: '',
        semester: '',
        cgpa: '',
        loanAmount: '',
        phoneNumber: '',
        cnicFrontUri: null,
        cnicBackUri: null,
        fatherName: '',
        fatherOccupation: '',
        fatherSalary: '',
        siblings: '',
        additionalNotes: '',
        electricityBillUri: null,
        gasBillUri: null,
        waterBillUri: null,
      });

      setCurrentPage(1);
    }
  } catch (error) {
    console.error('Submission error:', error);

    let msg = 'Failed to submit application. Please try again.';

    if (error.response) {
      msg = error.response.data?.message || msg;
      console.error('Server response:', error.response.data);
    } else if (error.request) {
      msg = 'No response from server. Please check your internet.';
      console.error('No server response:', error.request);
    }

    Alert.alert('Error', msg);
  } finally {
    setIsLoading(false);
  }
};

  // Style helpers
  const inputContainerStyle = (hasError) => [
    styles.inputContainer,
    hasError && { borderBottomWidth: 2, borderBottomColor: 'red' }
  ];

  const cardStyle = (hasError) => [
    styles.card,
    hasError && { borderBottomWidth: 2, borderBottomColor: 'red' }
  ];

  const renderErrorMessage = (errorMessage) => {
    if (errorMessage) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Submitting your application...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.topSection}>
            {currentPage > 1 && (
              <TouchableOpacity onPress={prevPage}>
                <Feather name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Text style={styles.topText}>
              {currentPage === 1
                ? "Personal Information"
                : currentPage === 2
                ? "Family Information"
                : "Additional Information"}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarMain}>
            {[1, 2, 3].map((page) => (
              <View
                key={page}
                style={[
                  styles.progressBar,
                  {
                    backgroundColor:
                      currentPage === page
                        ? "rgba(3, 9, 96, 1)"
                        : "rgba(3, 9, 96, 0.3)",
                  },
                ]}
              />
            ))}
          </View>

          {/* Page 1: Personal Info */}
          {currentPage === 1 && (
            <>
              <View>
                <View style={inputContainerStyle(errors.registrationNo)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Registration No *"
                    value={formData.registrationNo}
                    onChangeText={(text) => handleInputChange('registrationNo', text)}
                  />
                  <MaterialIcons name="credit-card" size={18} color="rgba(3, 9, 96, 1)" />
                  
                </View>
                {renderErrorMessage(errors.registrationNo)}
                
              </View>

              <View>
                <View style={inputContainerStyle(errors.email)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    autoCapitalize="none"
                  />
                  <Feather name="mail" size={18} color="rgba(3,9,96,1)" />
                </View>
                {renderErrorMessage(errors.email)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.studentName)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Student Name *"
                    value={formData.studentName}
                    onChangeText={(text) => handleInputChange('studentName', text)}
                  />
                </View>
                {renderErrorMessage(errors.studentName)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.department)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Department *"
                    value={formData.department}
                    onChangeText={(text) => handleInputChange('department', text)}
                  />
                </View>
                {renderErrorMessage(errors.department)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.semester)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Semester * (0-7)"
                    keyboardType="numeric"
                    value={formData.semester}
                    onChangeText={(text) => handleInputChange('semester', text)}
                    maxLength={1}
                  />
                </View>
                {renderErrorMessage(errors.semester)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.cgpa)}>
                  <TextInput
                    style={styles.input}
                    placeholder="CGPA * (0-4)"
                    keyboardType="decimal-pad"
                    value={formData.cgpa}
                    onChangeText={(text) => handleInputChange('cgpa', text)}
                    maxLength={4}
                  />
                  <SimpleLineIcons name="graduation" size={18} color="rgba(3,9,96,1)" />
                </View>
                {renderErrorMessage(errors.cgpa)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.loanAmount)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Loan Amount *"
                    keyboardType="numeric"
                    value={formData.loanAmount}
                    onChangeText={(text) => handleInputChange('loanAmount', text)}
                  />
                  <Feather name="dollar-sign" size={18} color="rgba(3,9,96,1)" />
                </View>
                {renderErrorMessage(errors.loanAmount)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.phoneNumber)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number *"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(text) => handleInputChange('phoneNumber', text)}
                    maxLength={15}
                  />
                  <Feather name="phone" size={18} color="rgba(3,9,96,1)" />
                </View>
                {renderErrorMessage(errors.phoneNumber)}
              </View>

              {/* CNIC Front Upload */}
              <View style={styles.cardMain}>
                <Text style={styles.sectionTitle}>CNIC Front Side *</Text>
                <TouchableOpacity
                  style={cardStyle(errors.cnicFrontUri)}
                  onPress={() => pickImage('cnicFrontUri')}
                >
                  <Feather name="upload" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Upload CNIC Front</Text>
                </TouchableOpacity>
                {formData.cnicFrontUri ? (
                  <Image source={{ uri: formData.cnicFrontUri }} style={styles.imagePreview} />
                ) : null}
                <TouchableOpacity
                  style={cardStyle(errors.cnicFrontUri)}
                  onPress={() => takePhoto('cnicFrontUri')}
                >
                  <Feather name="camera" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Take Photo</Text>
                </TouchableOpacity>
                {renderErrorMessage(errors.cnicFrontUri)}
              </View>

              {/* CNIC Back Upload */}
              <View style={styles.cardMain}>
                <Text style={styles.sectionTitle}>CNIC Back Side *</Text>
                <TouchableOpacity
                  style={cardStyle(errors.cnicBackUri)}
                  onPress={() => pickImage('cnicBackUri')}
                >
                  <Feather name="upload" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Upload CNIC Back</Text>
                </TouchableOpacity>
                {formData.cnicBackUri ? (
                  <Image source={{ uri: formData.cnicBackUri }} style={styles.imagePreview} />
                ) : null}
                <TouchableOpacity
                  style={cardStyle(errors.cnicBackUri)}
                  onPress={() => takePhoto('cnicBackUri')}
                >
                  <Feather name="camera" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Take Photo</Text>
                </TouchableOpacity>
                {renderErrorMessage(errors.cnicBackUri)}
              </View>
            </>
          )}

          {/* Page 2: Family Info */}
          {currentPage === 2 && (
            <>
              <View>
                <View style={inputContainerStyle(errors.fatherName)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Father Name *"
                    value={formData.fatherName}
                    onChangeText={(text) => handleInputChange('fatherName', text)}
                  />
                </View>
                {renderErrorMessage(errors.fatherName)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.fatherOccupation)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Father Occupation *"
                    value={formData.fatherOccupation}
                    onChangeText={(text) => handleInputChange('fatherOccupation', text)}
                  />
                </View>
                {renderErrorMessage(errors.fatherOccupation)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.fatherSalary)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Father Salary *"
                    keyboardType="numeric"
                    value={formData.fatherSalary}
                    onChangeText={(text) => handleInputChange('fatherSalary', text)}
                  />
                </View>
                {renderErrorMessage(errors.fatherSalary)}
              </View>

              <View>
                <View style={inputContainerStyle(errors.siblings)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Number of Siblings *"
                    keyboardType="numeric"
                    value={formData.siblings}
                    onChangeText={(text) => handleInputChange('siblings', text)}
                  />
                </View>
                {renderErrorMessage(errors.siblings)}
              </View>

              <View style={[styles.inputContainer, { height: 100 }]}>
                <TextInput
                  style={[styles.input, { textAlignVertical: "top" }]}
                  placeholder="Additional Notes"
                  multiline
                  value={formData.additionalNotes}
                  onChangeText={(text) => handleInputChange('additionalNotes', text)}
                />
              </View>
            </>
          )}

          {/* Page 3: Additional Info */}
          {currentPage === 3 && (
            <>
              {/* Electricity Bill Upload */}
              <View style={styles.cardMain}>
                <Text style={styles.sectionTitle}>Electricity Bill *</Text>
                <TouchableOpacity
                  style={cardStyle(errors.electricityBillUri)}
                  onPress={() => pickImage('electricityBillUri')}
                >
                  <Feather name="upload" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Upload Electricity Bill</Text>
                </TouchableOpacity>
                {formData.electricityBillUri ? (
                  <Image source={{ uri: formData.electricityBillUri }} style={styles.imagePreview} />
                ) : null}
                <TouchableOpacity
                  style={cardStyle(errors.electricityBillUri)}
                  onPress={() => takePhoto('electricityBillUri')}
                >
                  <Feather name="camera" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Take Photo</Text>
                </TouchableOpacity>
                {renderErrorMessage(errors.electricityBillUri)}
              </View>

              {/* Gas Bill Upload */}
              <View style={styles.cardMain}>
                <Text style={styles.sectionTitle}>Gas Bill *</Text>
                <TouchableOpacity
                  style={cardStyle(errors.gasBillUri)}
                  onPress={() => pickImage('gasBillUri')}
                >
                  <Feather name="upload" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Upload Gas Bill</Text>
                </TouchableOpacity>
                {formData.gasBillUri ? (
                  <Image source={{ uri: formData.gasBillUri }} style={styles.imagePreview} />
                ) : null}
                <TouchableOpacity
                  style={cardStyle(errors.gasBillUri)}
                  onPress={() => takePhoto('gasBillUri')}
                >
                  <Feather name="camera" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Take Photo</Text>
                </TouchableOpacity>
                {renderErrorMessage(errors.gasBillUri)}
              </View>

              {/* Water Bill Upload */}
              <View style={styles.cardMain}>
                <Text style={styles.sectionTitle}>Water Bill *</Text>
                <TouchableOpacity
                  style={cardStyle(errors.waterBillUri)}
                  onPress={() => pickImage('waterBillUri')}
                >
                  <Feather name="upload" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Upload Water Bill</Text>
                </TouchableOpacity>
                {formData.waterBillUri ? (
                  <Image source={{ uri: formData.waterBillUri }} style={styles.imagePreview} />
                ) : null}
                <TouchableOpacity
                  style={cardStyle(errors.waterBillUri)}
                  onPress={() => takePhoto('waterBillUri')}
                >
                  <Feather name="camera" size={24} color="rgba(3,9,96,1)" />
                  <Text style={styles.cardText}>Take Photo</Text>
                </TouchableOpacity>
                {renderErrorMessage(errors.waterBillUri)}
              </View>
            </>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonGroup}>
            {currentPage > 1 && (
              <TouchableOpacity style={styles.backBtn} onPress={prevPage}>
                <Feather name="arrow-left" size={20} color="white" />
                <Text style={styles.btnText}>Previous</Text>
              </TouchableOpacity>
            )}

            {currentPage < totalPages ? (
              <TouchableOpacity 
                style={[styles.nextBtn, !isCurrentPageComplete() && { opacity: 0.5 }]} 
                onPress={nextPage}
                // disabled={!isCurrentPageComplete()}
              >
                <Text style={styles.btnText}>Next</Text>
                <Feather name="arrow-right" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: "green" }, !isCurrentPageComplete() && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={!isCurrentPageComplete()}
              >
                <Text style={styles.btnText}>Submit</Text>
                <Feather name="check" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    flexGrow: 1,
    backgroundColor: "white",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  topText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
    color: "rgba(3,9,96,1)",
  },
  progressBarMain: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  progressBar: {
    height: 7,
    width: "30%",
    borderRadius: 7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(3,9,96,0.3)",
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 7,
    paddingHorizontal: 12,
    height: 70,
  },
  input: {
    flex: 1,
    color: "rgba(3,9,96,1)",
    fontWeight: "600",
    fontSize: 14,
  },
  cardMain: {
    marginTop: 15,
    alignItems: "center",
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '600',
    color: 'rgba(3,9,96,1)',
  },
  card: {
    backgroundColor: "rgba(3, 9, 96, 0.1)",
    width: "100%",
    height: 60,
    borderRadius: 15,
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  cardText: {
    fontWeight: "600",
    color: "rgba(3, 9, 96, 1)",
    fontSize: 16,
  },
  imagePreview: {
    width: 120,
    height: 80,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonGroup: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextBtn: {
    backgroundColor: "rgba(3, 9, 96, 1)",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  backBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  errorContainer: {
    alignSelf: 'flex-start',
    marginTop: -5,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

