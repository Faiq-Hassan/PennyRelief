import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/Project.Api';
import { useSelector } from 'react-redux';

const EditProfileScreen = () => {
  const { user, token } = useSelector((state) => state.login);
  const [profile, setProfile] = useState({
    fullName: user?.StudentName || '',
    phone: user?.phoneNo || '',
    password: '', // Password should be handled separately
  });

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Only send the fields that are being updated
      const updateData = {
        StudentName: profile.fullName,
        phoneNo: profile.phone,
        ...(profile.password && { password: profile.password }) // Only include password if provided
      };

      const response = await axios.put(
        `${API_ENDPOINTS.updateProfile}/${user._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={profile.fullName}
        editable={false} 
         selectTextOnFocus={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={profile.phone}
        keyboardType="phone-pad"
        editable={false} // Assuming phone number is not editable
         selectTextOnFocus={false}
      
      />

      <TextInput
        style={styles.input}
        placeholder="New Password (leave blank to keep current)"
        secureTextEntry
        value={profile.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default EditProfileScreen;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f6f8',
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 50 : 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#113f8c',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#113f8c',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
