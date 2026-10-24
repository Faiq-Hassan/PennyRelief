
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Automatically resolve API URL: defaults to live production server so Expo Go works seamlessly on physical devices
const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  // If explicitly configured to an external URL or LAN IP (not localhost), use it
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '');
  }

  // Default to live production server so mobile app connects reliably from any network (4G/5G/Wi-Fi)
  return 'https://pennyrelief.autosols.com';
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
