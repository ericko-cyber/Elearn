// src/utils/VisionCameraPermission.js
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export const requestCameraPermission = async () => {
  try {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log('Camera permission result:', permission);
    
    if (permission === 'granted' || permission === 'authorized') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const checkCameraPermission = async () => {
  try {
    const permission = await Camera.getCameraPermissionStatus();
    console.log('Current camera permission:', permission);
    return permission === 'granted' || permission === 'authorized';
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

export const showPermissionAlert = () => {
  return new Promise((resolve) => {
    Alert.alert(
      'Izin Kamera Diperlukan',
      'Aplikasi memerlukan akses kamera untuk fitur eye tracking. Silakan berikan izin kamera.',
      [
        {
          text: 'Batal',
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: 'Buka Pengaturan',
          onPress: () => {
            Linking.openSettings();
            resolve(false);
          },
        },
        {
          text: 'Berikan Izin',
          onPress: async () => {
            const granted = await requestCameraPermission();
            resolve(granted);
          },
        },
      ]
    );
  });
};

export const handleCameraPermissionFlow = async () => {
  try {
    // Check current permission status
    const hasPermission = await checkCameraPermission();
    
    if (hasPermission) {
      return { success: true, message: 'Permission already granted' };
    }

    // Request permission
    const granted = await requestCameraPermission();
    
    if (granted) {
      return { success: true, message: 'Permission granted' };
    }

    // Show alert if permission denied
    const alertResult = await showPermissionAlert();
    
    if (alertResult) {
      return { success: true, message: 'Permission granted via alert' };
    } else {
      return { success: false, message: 'Permission denied' };
    }
    
  } catch (error) {
    console.error('Permission flow error:', error);
    return { success: false, message: 'Permission flow failed' };
  }
};