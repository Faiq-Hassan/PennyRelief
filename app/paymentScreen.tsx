import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/Project.Api';

export default function PaymentScreen() {
  const [formData, setFormData] = useState({
    amount: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!formData.amount || !formData.customerName || !formData.customerPhone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.Payment, {
        amount: formData.amount,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        description: formData.description
      });

      if (response.data.success && response.data.paymentUrl) {
        await Linking.openURL(response.data.paymentUrl);
      } else {
        Alert.alert('Error', 'Payment initiation failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Micro-Payment</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Amount (PKR)"
        keyboardType="numeric"
        value={formData.amount}
        onChangeText={(text) => setFormData({...formData, amount: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.customerName}
        onChangeText={(text) => setFormData({...formData, customerName: text})}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.customerEmail}
        onChangeText={(text) => setFormData({...formData, customerEmail: text})}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.customerPhone}
        onChangeText={(text) => setFormData({...formData, customerPhone: text})}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#11408c" />
      ) : (
        <Button title="Pay Now" onPress={handlePayment} color="#11408c" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#11408c'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  }
});