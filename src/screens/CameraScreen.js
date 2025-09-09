import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  Animated,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');

// ✅ Konfigurasi lokasi yang diizinkan - UBAH SESUAI LOKASI ANDA -8.15756021836678, 113.72278456645434
const ALLOWED_LOCATION = {
  latitude: -8.15756021836678,          // Ganti dengan koordinat lokasi Anda
  longitude: 113.72278456645434,        // Ganti dengan koordinat lokasi Anda
  radius: 100,                // Radius toleransi dalam meter (100m)
  name: 'Gedung Teknologi Informasi' // Ganti dengan nama lokasi Anda
};

// ✅ Fungsi untuk menghitung jarak antara dua koordinat (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Daftar instruksi gerakan acak untuk liveness detection
const LIVENESS_ACTIONS = [
  {
    action: 'blink',
    instruction: 'Kedipkan mata Anda',
    icon: 'remove-red-eye',
    duration: 4000,
  },
  {
    action: 'smile',
    instruction: 'Tersenyumlah',
    icon: 'sentiment-very-satisfied',
    duration: 4000,
  },
  {
    action: 'turn_left',
    instruction: 'Putar kepala ke kiri',
    icon: 'keyboard-arrow-left',
    duration: 4000,
  },
  {
    action: 'turn_right',
    instruction: 'Putar kepala ke kanan',
    icon: 'keyboard-arrow-right',
    duration: 4000,
  },
  {
    action: 'nod',
    instruction: 'Anggukkan kepala',
    icon: 'keyboard-arrow-down',
    duration: 4000,
  },
  {
    action: 'open_mouth',
    instruction: 'Buka mulut Anda',
    icon: 'record-voice-over',
    duration: 4000,
  },
];

export default function CameraScreen({ navigation }) {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();

  // States untuk liveness detection
  const [currentStep, setCurrentStep] = useState(0);
  const [livenessActions, setLivenessActions] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('idle');
  const [countdown, setCountdown] = useState(3);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionCountdown, setActionCountdown] = useState(4);
  const [completedActions, setCompletedActions] = useState([]);

  // Face detection states - dengan posisi wajah
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [faceStability, setFaceStability] = useState(0);

  // ✅ Geolocation states - DIPERBAIKI
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationValidation, setLocationValidation] = useState({
    isValid: false,
    distance: null,
    message: 'Belum ada data lokasi'
  });

  const [animatedValue] = useState(new Animated.Value(1));
  const [pulseValue] = useState(new Animated.Value(1));
  const [faceFrameAnimated] = useState(new Animated.Value(1));

  // Refs untuk tracking
  const detectionInterval = useRef(null);
  const stabilityCheckCount = useRef(0);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }

    // Request location permission dan get current location
    requestLocationPermission();

    // Cleanup saat component unmount
    return () => {
      isComponentMounted.current = false;
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [hasPermission]);

  // Request Location Permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Lokasi Diperlukan',
            message: 'Aplikasi memerlukan akses lokasi untuk presensi',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Tolak',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          getCurrentLocation();
        } else {
          setLocationPermission(false);
          setLocationValidation({
            isValid: false,
            distance: null,
            message: 'Izin lokasi ditolak'
          });
          Alert.alert(
            'Izin Lokasi Diperlukan',
            'Untuk melakukan presensi, aplikasi memerlukan akses lokasi Anda.',
            [
              { text: 'Batal', style: 'cancel' },
              {
                text: 'Buka Pengaturan',
                onPress: () => requestLocationPermission(),
              },
            ],
          );
        }
      } else {
        // For iOS
        setLocationPermission(true);
        getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
      setLocationError('Gagal mendapatkan izin lokasi');
      setLocationValidation({
        isValid: false,
        distance: null,
        message: 'Gagal mendapatkan izin lokasi'
      });
    }
  };

  // ✅ Get Current Location - DIPERBAIKI dengan validasi lokasi
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setLocationValidation({
      isValid: false,
      distance: null,
      message: 'Memvalidasi lokasi...'
    });

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        const currentLocation = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        };
        
        // ✅ Validasi apakah lokasi dalam radius yang diizinkan
        const distance = calculateDistance(
          latitude, 
          longitude, 
          ALLOWED_LOCATION.latitude, 
          ALLOWED_LOCATION.longitude
        );
        
        const isValidLocation = distance <= ALLOWED_LOCATION.radius;
        
        setLocation(currentLocation);
        setLocationValidation({
          isValid: isValidLocation,
          distance: Math.round(distance),
          message: isValidLocation 
            ? `✅ Lokasi valid (${Math.round(distance)}m dari ${ALLOWED_LOCATION.name})`
            : `❌ Anda berada ${Math.round(distance)}m dari ${ALLOWED_LOCATION.name}. Maksimal jarak: ${ALLOWED_LOCATION.radius}m`
        });
        setIsGettingLocation(false);
        
        // ✅ Alert jika lokasi tidak valid
        if (!isValidLocation) {
          Alert.alert(
            'Lokasi Tidak Valid',
            `Anda harus berada dalam radius ${ALLOWED_LOCATION.radius}m dari ${ALLOWED_LOCATION.name} untuk melakukan presensi.\n\nJarak Anda saat ini: ${Math.round(distance)}m\nAkurasi GPS: ±${Math.round(accuracy)}m`,
            [
              { text: 'OK' },
              { text: 'Refresh Lokasi', onPress: getCurrentLocation }
            ]
          );
        }
      },
      error => {
        console.error('Location Error:', error);
        const errorMessage = 'Gagal mendapatkan lokasi: ' + error.message;
        setLocationError(errorMessage);
        setLocationValidation({
          isValid: false,
          distance: null,
          message: 'Gagal mengakses lokasi GPS'
        });
        setIsGettingLocation(false);

        // Retry dengan opsi yang berbeda
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude, accuracy } = position.coords;
            const currentLocation = {
              latitude,
              longitude,
              accuracy,
              timestamp: new Date().toISOString(),
            };
            
            const distance = calculateDistance(
              latitude, 
              longitude, 
              ALLOWED_LOCATION.latitude, 
              ALLOWED_LOCATION.longitude
            );
            
            const isValidLocation = distance <= ALLOWED_LOCATION.radius;
            
            setLocation(currentLocation);
            setLocationValidation({
              isValid: isValidLocation,
              distance: Math.round(distance),
              message: isValidLocation 
                ? `✅ Lokasi valid (${Math.round(distance)}m dari ${ALLOWED_LOCATION.name})`
                : `❌ Anda berada ${Math.round(distance)}m dari ${ALLOWED_LOCATION.name}. Maksimal jarak: ${ALLOWED_LOCATION.radius}m`
            });
            setIsGettingLocation(false);
          },
          retryError => {
            setLocationError('Tidak dapat mengakses lokasi. Pastikan GPS aktif.');
            setLocationValidation({
              isValid: false,
              distance: null,
              message: 'GPS tidak dapat diakses'
            });
            setIsGettingLocation(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
          },
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // Simulasi face detection dengan posisi wajah yang dinamis
  const startFaceDetectionSimulation = useCallback(() => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }

    detectionInterval.current = setInterval(() => {
      if (!isComponentMounted.current) return;

      // Simulasi face detection yang lebih realistis dengan posisi
      const mockDetection = () => {
        const lightingGood = Math.random() > 0.1;
        const faceInPosition = Math.random() > 0.15;
        const cameraStable = Math.random() > 0.1;

        const currentlyDetected =
          lightingGood && faceInPosition && cameraStable;

        if (currentlyDetected) {
          stabilityCheckCount.current++;

          // Simulasi posisi wajah yang bergerak sedikit
          const centerX = width / 2;
          const centerY = height / 2;
          const faceWidth = 120 + Math.random() * 40; // 120-160px
          const faceHeight = 150 + Math.random() * 50; // 150-200px

          const offsetX = (Math.random() - 0.5) * 60; // ±30px movement
          const offsetY = (Math.random() - 0.5) * 40; // ±20px movement

          setFacePosition({
            x: centerX - faceWidth / 2 + offsetX,
            y: centerY - faceHeight / 2 + offsetY,
            width: faceWidth,
            height: faceHeight,
          });
        } else {
          stabilityCheckCount.current = Math.max(
            0,
            stabilityCheckCount.current - 2,
          );
        }

        const isStable = stabilityCheckCount.current >= 5;
        const stability = Math.min(1, stabilityCheckCount.current / 10);

        setFaceDetected(isStable);
        setFaceStability(stability);
      };

      mockDetection();
    }, 200);
  }, []);

  useEffect(() => {
    startFaceDetectionSimulation();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [startFaceDetectionSimulation]);

  // Generate random liveness actions
  const generateLivenessActions = () => {
    const shuffled = [...LIVENESS_ACTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setLivenessActions(selected);
    setCurrentStep(0);
    setCompletedActions([]);
  };

  // ✅ Start liveness detection process - DIPERBAIKI dengan validasi lokasi
  const startLivenessDetection = () => {
    // Check face detection
    if (!faceDetected) {
      Alert.alert(
        'Wajah Tidak Terdeteksi',
        'Pastikan wajah Anda terlihat jelas dalam frame sebelum memulai liveness detection.',
        [{ text: 'OK' }],
      );
      return;
    }

    // Check location permission
    if (!location && !isGettingLocation) {
      Alert.alert(
        'Lokasi Diperlukan',
        'Untuk melakukan presensi, lokasi Anda harus dapat diakses. Coba dapatkan lokasi lagi?',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Coba Lagi', onPress: getCurrentLocation },
        ],
      );
      return;
    }

    // ✅ Check location validation - BARU DITAMBAHKAN
    if (location && !locationValidation.isValid) {
      Alert.alert(
        'Lokasi Tidak Valid',
        locationValidation.message + '\n\nAnda harus berada di area yang diizinkan untuk melakukan presensi.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Refresh Lokasi', onPress: getCurrentLocation }
        ]
      );
      return;
    }

    if (isGettingLocation) {
      Alert.alert(
        'Mendapatkan Lokasi',
        'Sedang memvalidasi lokasi Anda. Mohon tunggu sebentar.',
        [{ text: 'OK' }],
      );
      return;
    }

    generateLivenessActions();
    setIsDetecting(true);
    setDetectionStatus('ready');
    setCountdown(3);
  };

  // Animasi untuk face detection overlay
  useEffect(() => {
    if (!isComponentMounted.current) return;

    if (faceDetected) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(faceFrameAnimated, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(faceFrameAnimated, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();

      return () => animation.stop();
    } else {
      faceFrameAnimated.setValue(1);
    }
  }, [faceDetected]);

  // Main detection logic
  useEffect(() => {
    if (!isComponentMounted.current) return;

    let interval;

    if (detectionStatus === 'ready') {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            if (isComponentMounted.current) {
              setDetectionStatus('action');
              setCurrentAction(livenessActions[0]);
              setActionCountdown(livenessActions[0]?.duration / 1000 || 4);
            }
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (detectionStatus === 'action' && currentAction) {
      interval = setInterval(() => {
        setActionCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);

            if (!isComponentMounted.current) return 4;

            // Check if face is still detected
            if (!faceDetected) {
              setDetectionStatus('failed');
              Alert.alert(
                'Deteksi Gagal',
                'Wajah tidak terdeteksi saat melakukan instruksi.',
                [{ text: 'OK' }],
              );
              setTimeout(() => {
                if (isComponentMounted.current) {
                  setDetectionStatus('idle');
                  setIsDetecting(false);
                  setCurrentAction(null);
                  setCompletedActions([]);
                }
              }, 2000);
              return 4;
            }

            // Enhanced validation
            const faceStabilityGood = faceStability > 0.6;
            const actionSuccess = faceStabilityGood && Math.random() > 0.2;

            if (actionSuccess) {
              const newCompleted = [...completedActions, currentAction.action];
              setCompletedActions(newCompleted);

              if (currentStep < livenessActions.length - 1) {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                setCurrentAction(livenessActions[nextStep]);
                setActionCountdown(livenessActions[nextStep].duration / 1000);
                return livenessActions[nextStep].duration / 1000;
              } else {
                // All actions completed - Save attendance with location
                setDetectionStatus('success');
                saveAttendanceWithLocation();
              }
            } else {
              setDetectionStatus('failed');
              Alert.alert(
                'Instruksi Gagal',
                'Instruksi tidak diikuti dengan benar. Silakan coba lagi.',
                [{ text: 'OK' }],
              );
              setTimeout(() => {
                if (isComponentMounted.current) {
                  setDetectionStatus('idle');
                  setIsDetecting(false);
                  setCurrentAction(null);
                  setCompletedActions([]);
                }
              }, 2000);
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    detectionStatus,
    currentStep,
    livenessActions,
    currentAction,
    completedActions,
    faceDetected,
    faceStability,
  ]);

  // ✅ Save attendance with location - DIPERBAIKI
  const saveAttendanceWithLocation = () => {
    const attendanceData = {
      timestamp: new Date().toISOString(),
      location: location,
      locationValidation: {
        isValid: locationValidation.isValid,
        distance: locationValidation.distance,
        allowedLocation: ALLOWED_LOCATION,
        validationMessage: locationValidation.message
      },
      livenessVerified: true,
      completedActions: completedActions,
      faceStability: faceStability,
      userId: 'EMP001', // Replace dengan actual user ID dari sistem login Anda
    };

    // Here you would typically send this data to your backend
    console.log('✅ Attendance Data Saved:', JSON.stringify(attendanceData, null, 2));

    setTimeout(() => {
      if (isComponentMounted.current) {
        Alert.alert(
          'Presensi Berhasil!',
          `Liveness detection berhasil dan presensi telah tersimpan.\n\n📍 ${ALLOWED_LOCATION.name}\nJarak: ${locationValidation.distance}m\nAkurasi GPS: ±${location?.accuracy?.toFixed(0)}m`,
          [{ text: 'OK', onPress: () => navigation?.goBack() }],
        );
      }
    }, 1500);
  };

  // Animasi untuk detection frame
  useEffect(() => {
    if (!isComponentMounted.current) return;

    if (detectionStatus === 'action') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();

      return () => animation.stop();
    } else {
      animatedValue.setValue(1);
    }
  }, [detectionStatus]);

  // Animasi pulse untuk icon
  useEffect(() => {
    if (!isComponentMounted.current) return;

    if (currentAction) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();

      return () => animation.stop();
    } else {
      pulseValue.setValue(1);
    }
  }, [currentAction]);

  const handleGoBack = () => {
    isComponentMounted.current = false;
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }

    if (navigation) {
      navigation.goBack();
    } else {
      Alert.alert(
        'Kembali',
        'Fungsi kembali akan mengarahkan ke halaman sebelumnya',
      );
    }
  };

  const getFaceOverlayColor = () => {
    if (!faceDetected && detectionStatus !== 'idle') {
      return '#F44336';
    }

    switch (detectionStatus) {
      case 'idle':
        return faceDetected ? '#4CAF50' : '#FFD700';
      case 'ready':
        return '#FFD700';
      case 'action':
        return '#2196F3';
      case 'success':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      default:
        return '#FFD700';
    }
  };

  // ✅ Status text - DIPERBAIKI
  const getStatusText = () => {
    if (isGettingLocation) {
      return 'Memvalidasi lokasi...';
    }

    if (!location && !locationError) {
      return 'Lokasi diperlukan untuk presensi';
    }

    if (locationError) {
      return 'Gagal mengakses lokasi';
    }

    if (location && !locationValidation.isValid) {
      return 'Lokasi tidak valid untuk presensi';
    }

    if (!faceDetected && detectionStatus !== 'idle') {
      return 'Wajah tidak terdeteksi!';
    }

    switch (detectionStatus) {
      case 'idle':
        if (!faceDetected) {
          return 'Posisikan wajah dalam kamera';
        }
        return 'Siap memulai liveness detection';
      case 'ready':
        return `Bersiap... ${countdown}`;
      case 'action':
        return currentAction?.instruction || 'Lakukan instruksi';
      case 'success':
        return 'Liveness detection berhasil!';
      case 'failed':
        return 'Deteksi gagal';
      default:
        return 'Posisikan wajah dalam kamera';
    }
  };

  // ✅ Subtitle text - DIPERBAIKI
  const getSubtitleText = () => {
    if (isGettingLocation) {
      return 'Memproses dan memvalidasi lokasi Anda...';
    }

    if (locationError) {
      return 'Ketuk untuk mencoba mengakses lokasi lagi';
    }

    if (!location) {
      return `Presensi harus dilakukan di ${ALLOWED_LOCATION.name}`;
    }

    if (location && !locationValidation.isValid) {
      return locationValidation.message;
    }

    if (!faceDetected && detectionStatus !== 'idle') {
      return 'Pastikan wajah tetap terlihat dalam kamera';
    }

    switch (detectionStatus) {
      case 'idle':
        if (!faceDetected) {
          return `Stabilitas: ${Math.round(faceStability * 100)}% | Lokasi: ${locationValidation.isValid ? '✅' : '❌'}`;
        }
        return locationValidation.isValid 
          ? `Siap memulai | Jarak: ${locationValidation.distance}m dari ${ALLOWED_LOCATION.name}`
          : 'Pindah ke lokasi yang diizinkan untuk presensi';
      case 'ready':
        return 'Jangan bergerak, segera dimulai...';
      case 'action':
        return `${actionCountdown}s - Ikuti instruksi dengan natural`;
      case 'success':
        return 'Presensi akan segera disimpan dengan lokasi';
      case 'failed':
        return 'Silakan coba lagi';
      default:
        return 'Pastikan wajah terlihat jelas dan terang';
    }
  };

  if (device == null) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <Icon name="camera-alt" size={80} color="#666" />
        <Text style={styles.errorTitle}>Kamera Tidak Ditemukan</Text>
        <Text style={styles.errorSubtitle}>
          Pastikan perangkat memiliki kamera yang berfungsi
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <Icon name="block" size={80} color="#666" />
        <Text style={styles.errorTitle}>Izin Kamera Diperlukan</Text>
        <Text style={styles.errorSubtitle}>
          Aplikasi memerlukan akses kamera untuk melakukan presensi
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Berikan Izin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <Icon name="camera-alt" size={80} color="#666" />
        <Text style={styles.errorTitle}>Kamera Tidak Ditemukan</Text>
        <Text style={styles.errorSubtitle}>
          Pastikan perangkat memiliki kamera yang berfungsi
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <Icon name="block" size={80} color="#666" />
        <Text style={styles.errorTitle}>Izin Kamera Diperlukan</Text>
        <Text style={styles.errorSubtitle}>
          Aplikasi memerlukan akses kamera untuk melakukan presensi
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Berikan Izin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Camera */}
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Presensi Liveness</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Status Indicators */}
      <View style={styles.statusContainer}>
        {/* Face Detection Status */}
        <View style={styles.statusItem}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: faceDetected ? '#4CAF50' : '#F44336',
              },
            ]}
          />
          <Text style={styles.statusText}>
            {faceDetected ? 'Wajah Terdeteksi' : 'Mencari Wajah'}
          </Text>
        </View>

        {/* Location Status */}
        <View style={styles.statusItem}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: location
                  ? '#4CAF50'
                  : isGettingLocation
                  ? '#FFD700'
                  : '#F44336',
              },
            ]}
          />
          <Text style={styles.statusText}>
            {location
              ? 'Lokasi Tersedia'
              : isGettingLocation
              ? 'Mendapatkan Lokasi'
              : 'Lokasi Diperlukan'}
          </Text>
        </View>
      </View>

      {/* Face Detection Overlay - Langsung mengikuti wajah */}
      {faceDetected && (
        <Animated.View
          style={[
            styles.faceOverlay,
            {
              left: facePosition.x,
              top: facePosition.y,
              width: facePosition.width,
              height: facePosition.height,
              transform: [{ scale: faceFrameAnimated }],
              borderColor: getFaceOverlayColor(),
            },
          ]}
        >
          {/* Face detection particles/dots around face */}
          <View style={[styles.faceCorner, styles.topLeftCorner]} />
          <View style={[styles.faceCorner, styles.topRightCorner]} />
          <View style={[styles.faceCorner, styles.bottomLeftCorner]} />
          <View style={[styles.faceCorner, styles.bottomRightCorner]} />

          {/* Center detection indicator */}
          <View style={styles.centerIndicator}>
            <View
              style={[
                styles.centerDot,
                { backgroundColor: getFaceOverlayColor() },
              ]}
            />
          </View>
        </Animated.View>
      )}

      {/* Action Instruction with Icon */}
      {currentAction && (
        <View style={styles.actionContainer}>
          <Animated.View
            style={{
              transform: [{ scale: pulseValue }, { scale: animatedValue }],
            }}
          >
            <Icon
              name={currentAction.icon}
              size={60}
              color="#2196F3"
              style={styles.actionIcon}
            />
          </Animated.View>
        </View>
      )}

      {/* Progress Indicator */}
      {livenessActions.length > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Langkah {currentStep + 1} dari {livenessActions.length}
          </Text>
          <View style={styles.progressBar}>
            {livenessActions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      index < currentStep
                        ? '#4CAF50'
                        : index === currentStep && detectionStatus === 'action'
                        ? '#2196F3'
                        : 'rgba(255, 255, 255, 0.3)',
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>{getStatusText()}</Text>
        <Text style={styles.instructionSubtitle}>{getSubtitleText()}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {locationError && !isGettingLocation && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Icon name="my-location" size={24} color="white" />
            <Text style={styles.locationButtonText}>
              Coba Akses Lokasi Lagi
            </Text>
          </TouchableOpacity>
        )}

        {!isDetecting && detectionStatus !== 'success' && !locationError && (
          <TouchableOpacity
            style={[
              styles.captureButton,
              detectionStatus === 'failed' && styles.retryButton,
              (!faceDetected || !location || isGettingLocation) &&
                styles.disabledButton,
            ]}
            onPress={startLivenessDetection}
            disabled={!faceDetected || !location || isGettingLocation}
          >
            <Icon
              name={detectionStatus === 'failed' ? 'refresh' : 'security'}
              size={32}
              color="white"
            />
            <Text style={styles.captureButtonText}>
              {detectionStatus === 'failed'
                ? 'Coba Lagi'
                : 'Mulai Liveness Detection'}
            </Text>
          </TouchableOpacity>
        )}

        {detectionStatus === 'success' && (
          <View style={styles.successContainer}>
            <Icon name="verified" size={48} color="#4CAF50" />
            <Text style={styles.successText}>Liveness & Lokasi Verified!</Text>
            {location && (
              <Text style={styles.locationInfo}>
                📍 {ALLOWED_LOCATION.name} ({locationValidation.distance}m)
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  statusContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight + 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  faceOverlay: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  faceCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
  },
  topLeftCorner: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
  },
  topRightCorner: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 15,
  },
  bottomLeftCorner: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 15,
  },
  bottomRightCorner: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 15,
  },
  centerIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionContainer: {
    position: 'absolute',
    top: height * 0.25,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 50,
    padding: 20,
    zIndex: 1,
  },
  actionIcon: {
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: height * 0.15,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 15,
    zIndex: 1,
  },
  instructionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionSubtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButton: {
    backgroundColor: '#FF9500',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  locationButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 15,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  locationInfo: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});
