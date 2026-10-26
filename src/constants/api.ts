import Constants from 'expo-constants';
import { Platform } from 'react-native';

// In development, detect local machine IP or use localhost
const getLocalBackendUrl = () => {
  // If running in browser or web
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api/v1';
  }

  // If running in Android emulator
  if (Platform.OS === 'android') {
    // 10.0.2.2 points to host machine in Android standard emulator
    return 'http://10.0.2.2:3000/api/v1';
  }

  // If using physical device, replace with host machine Tailscale IP or LAN IP
  return 'http://100.70.232.78:3000/api/v1';
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getLocalBackendUrl();
export const RUSTFS_BASE_URL = process.env.EXPO_PUBLIC_RUSTFS_URL || 'http://100.110.120.15:9004';
