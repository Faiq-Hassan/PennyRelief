
// Reads from Expo environment variable (EXPO_PUBLIC_API_URL) with fallback
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
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
