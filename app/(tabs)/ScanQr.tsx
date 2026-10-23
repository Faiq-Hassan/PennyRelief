import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import AuthWrapper from '@/components/AuthWrapper';

const QRComingSoonScreen = () => {
  const navigation = useNavigation();

  return (
    <AuthWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#11408c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Payments</Text>
          <View style={{ width: 24 }} /> {/* Spacer for alignment */}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/LogoImg.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>QR Feature Coming Soon!</Text>
          <Text style={styles.subtitle}>
            We're working hard to bring you secure QR code payments.
            Stay tuned for updates!
          </Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11408c',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11408c',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#11408c',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRComingSoonScreen;