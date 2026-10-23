import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/Project.Api';
import AuthWrapper from '@/components/AuthWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Settings = () => {
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const openTermsModal = () => setTermsModalVisible(true);
  const closeTermsModal = () => setTermsModalVisible(false);

  const goToProfileUpdate = () => {
    router.push('/profileupdate');
  };

  const goToPasswordUpdate = () => {
    router.push('/passwordUpdate');
  };

  const LogoutHandler = async () => {
    try {
      await axios.post(API_ENDPOINTS.logout, {}, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
        },
      });
      await AsyncStorage.removeItem('authToken');
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully.',
      })
      Alert.alert('Success', 'Logged out successfully');
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error.response?.data?.message || 'An error occurred during logout.',
      })
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const openAboutModal = () => setAboutModalVisible(true);
  const closeAboutModal = () => setAboutModalVisible(false);
  const openComingSoonModal = () => setComingSoonModalVisible(true);
  const closeComingSoonModal = () => setComingSoonModalVisible(false);

  return (
    <AuthWrapper>
      <ScrollView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
        {/* Header */}
        <View style={styles.topMain}>
          <View style={styles.profileInfo}>
            <Text style={styles.bankTitle}>100's Rupees Bank</Text>
            <Text style={styles.tagline}>Manage Your Account Settings</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.container}>
          <SettingsSection title="Account">
            <SettingsItem icon="person" label="Edit Profile" onPress={goToProfileUpdate} />
            <SettingsItem icon="mail" label="Change Email" onPress={openComingSoonModal} />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsItem icon="lock-closed" label="Change Password" onPress={goToPasswordUpdate} />
          </SettingsSection>

          <SettingsSection title="Notifications">
            <SettingsItem icon="mail-open" label="Email Preferences" onPress={openComingSoonModal} />
          </SettingsSection>

          <SettingsSection title="Others">
            <SettingsItem icon="information-circle" label="About App" onPress={openAboutModal} />
            <SettingsItem icon="document-text" label="Terms & Conditions" onPress={openTermsModal} />
            <SettingsItem icon="log-out" label="Logout" onPress={LogoutHandler} />
          </SettingsSection>
        </View>
      </ScrollView>

      {/* Terms & Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={closeTermsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <Text style={styles.modalParagraph}>
                Welcome to 100's Rupees Bank. By using our platform, you agree to comply with the following terms and conditions.
              </Text>
              <Text style={styles.modalParagraph}>
                1. <Text style={styles.bold}>Eligibility:</Text> You must be at least 18 years old to participate.
              </Text>
              <Text style={styles.modalParagraph}>
                2. <Text style={styles.bold}>Interest-Free Loans:</Text> Our platform provides loans without interest, intended solely for educational and small business purposes.
              </Text>
              <Text style={styles.modalParagraph}>
                3. <Text style={styles.bold}>Contributions:</Text> Every member contributes ₹100 monthly to fund the interest-free loan pool.
              </Text>
              <Text style={styles.modalParagraph}>
                4. <Text style={styles.bold}>Repayments:</Text> Borrowers must repay loans on time as agreed to maintain fairness and sustainability.
              </Text>
              <Text style={styles.modalParagraph}>
                5. <Text style={styles.bold}>Privacy:</Text> We respect your privacy and handle your data securely as per our privacy policy.
              </Text>
              <Text style={styles.modalParagraph}>
                6. <Text style={styles.bold}>Dispute Resolution:</Text> Any disputes will be resolved through mediation and in accordance with applicable laws.
              </Text>
              <Text style={styles.modalFooter}>
                By continuing to use the platform, you accept these terms and conditions.
              </Text>
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={closeTermsModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Coming Soon Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={comingSoonModalVisible}
        onRequestClose={closeComingSoonModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Coming Soon!</Text>
            <Text style={styles.modalParagraph}>
              This feature is under development and will be available soon.
            </Text>
            <Pressable style={styles.closeButton} onPress={closeComingSoonModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* About App Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={closeAboutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>About 100's Rupees Bank</Text>
              <Text style={styles.modalParagraph}>
                Welcome to <Text style={styles.bold}>100's Rupees Bank</Text>, a unique interest-free loan platform dedicated to empowering students and aspiring entrepreneurs.
              </Text>
              <Text style={styles.modalParagraph}>
                Our mission is to create a community where everyone can contribute just ₹100 per month to help those in need get access to interest-free loans. These loans support education and small businesses, enabling individuals to improve their lives without the burden of debt.
              </Text>
              <Text style={styles.modalParagraph}>
                By fostering a culture of mutual support, transparency, and trust, we aim to make financial assistance accessible and ethical.
              </Text>
              <Text style={styles.modalParagraph}>
                Whether you are a donor or a borrower, your participation helps build a stronger, more inclusive community.
              </Text>
              <Text style={styles.modalFooter}>
                For more information, visit our website or contact our support team.
              </Text>
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={closeAboutModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AuthWrapper>
  );
};

const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingsItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={20} color="#11408c" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  topMain: {
    backgroundColor: 'rgba(17, 64, 140, 1)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 24,
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  bankTitle: {
    color: '#e3f2fd',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tagline: {
    color: 'white',
    fontSize: 14,
    fontWeight: '300',
    marginTop: 4,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#11408c',
    marginBottom: 12,
  },
  modalParagraph: {
    fontSize: 16,
    color: '#333',
    marginBottom: 14,
    lineHeight: 24,
  },
  modalFooter: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#11408c',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Settings;