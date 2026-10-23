
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Automatically resolve developer machine LAN IP when running on mobile devices / Expo Go
const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  // If explicitly configured to a remote URL or LAN IP (not localhost), use it
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // When running on physical device via Expo Go, dynamically retrieve the host IP
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri || '';
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5000`;
    }
  }

  // Mobile platforms need the LAN IP (192.168.0.102) because 'localhost' refers to the phone itself
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.0.102:5000';
  }

  return envUrl || 'http://localhost:5000';
};

export const API_URL = getApiBaseUrl();
export const API_ENDPOINTS = {
  signup: `${API_URL}/users/register`,
  login: `${API_URL}/users/login`,
  logout: `${API_URL}/users/logout`,
  application: `${API_URL}/users/application`,
  Otp: `${API_URL}/users/verify`,
  fetchProfile: `${API_URL}/users/profile`,
  updateProfile: `${API_URL}/users/updateProfile`,
  Payment : `${API_URL}/api/payment/initiate`,
  donations: `${API_URL}/admin/stripe/payers`,
};
