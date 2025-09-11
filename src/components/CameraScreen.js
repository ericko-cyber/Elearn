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
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Daftar instruksi gerakan acak untuk liveness detection
const LIVENESS_ACTIONS = [
  { 
    action: 'blink', 
    instruction: 'Kedipkan mata Anda', 
    icon: 'remove-red-eye',
    duration: 4000 
  },
  { 
    action: 'smile', 
    instruction: 'Tersenyumlah', 
    icon: 'sentiment-very-satisfied',
    duration: 4000 
  },
  { 
    action: 'turn_left', 
    instruction: 'Putar kepala ke kiri', 
    icon: 'keyboard-arrow-left',
    duration: 4000 
  },
  { 
    action: 'turn_right', 
    instruction: 'Putar kepala ke kanan', 
    icon: 'keyboard-arrow-right',
    duration: 4000 
  },
  { 
    action: 'nod', 
    instruction: 'Anggukkan kepala', 
    icon: 'keyboard-arrow-down',
    duration: 4000 
  },
  { 
    action: 'open_mouth', 
    instruction: 'Buka mulut Anda', 
    icon: 'record-voice-over',
    duration: 4000 
  }
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
  
  // Face detection states
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceStability, setFaceStability] = useState(0);
  
  const [animatedValue] = useState(new Animated.Value(1));
  const [pulseValue] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade animation for face frame
  
  // Refs untuk tracking
  const detectionInterval = useRef(null);
  const stabilityCheckCount = useRef(0);
  const isComponentMounted = useRef(true);
  
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    
    // Cleanup saat component unmount
    return () => {
      isComponentMounted.current = false;
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [hasPermission, requestPermission]);

  // Simulasi face detection tanpa frame processor
  const startFaceDetectionSimulation = useCallback(() => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    
    detectionInterval.current = setInterval(() => {
      if (!isComponentMounted.current) return;
      
      const lightingGood = Math.random() > 0.1;
      const faceInPosition = Math.random() > 0.2;
      const cameraStable = Math.random() > 0.1;
      
      const currentlyDetected = lightingGood && faceInPosition && cameraStable;
      
      if (currentlyDetected) {
        stabilityCheckCount.current++;
      } else {
        stabilityCheckCount.current = Math.max(0, stabilityCheckCount.current - 2);
      }
      
      const isStable = stabilityCheckCount.current >= 5;
      const stability = Math.min(1, stabilityCheckCount.current / 10);
      
      setFaceDetected(isStable);
      setFaceStability(stability);
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

  // Fade animation control
  useEffect(() => {
    if (faceDetected) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [faceDetected, fadeAnim]);

  // Generate random liveness actions
  const generateLivenessActions = () => {
    const shuffled = [...LIVENESS_ACTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setLivenessActions(selected);
    setCurrentStep(0);
    setCompletedActions([]);
  };

  // Start liveness detection process
  const startLivenessDetection = () => {
    if (!faceDetected) {
      Alert.alert(
        'Wajah Tidak Terdeteksi',
        'Pastikan wajah Anda terlihat jelas dalam frame sebelum memulai liveness detection.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    generateLivenessActions();
    setIsDetecting(true);
    setDetectionStatus('ready');
    setCountdown(3);
  };

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
            
            if (!faceDetected) {
              setDetectionStatus('failed');
              Alert.alert(
                'Deteksi Gagal',
                'Wajah tidak terdeteksi saat melakukan instruksi.',
                [{ text: 'OK' }]
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
                setDetectionStatus('success');
                setTimeout(() => {
                  if (isComponentMounted.current) {
                    Alert.alert(
                      'Presensi Berhasil!',
                      'Liveness detection berhasil dan presensi telah tersimpan.',
                      [{ text: 'OK', onPress: () => navigation?.goBack() }]
                    );
                  }
                }, 1500);
              }
            } else {
              setDetectionStatus('failed');
              Alert.alert(
                'Instruksi Gagal',
                'Instruksi tidak diikuti dengan benar. Silakan coba lagi.',
                [{ text: 'OK' }]
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
  }, [detectionStatus, currentStep, livenessActions, currentAction, completedActions, faceDetected, faceStability, navigation]);

  // Animasi scale untuk frame
  useEffect(() => {
    if (!isComponentMounted.current) return;
    
    if (detectionStatus === 'action') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      return () => animation.stop();
    } else {
      animatedValue.setValue(1);
    }
  }, [detectionStatus, animatedValue]);

  // Animasi pulse untuk icon
  useEffect(() => {
    if (!isComponentMounted.current) return;
    
    if (currentAction) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      return () => animation.stop();
    } else {
      pulseValue.setValue(1);
    }
  }, [currentAction, pulseValue]);

  const handleGoBack = () => {
    isComponentMounted.current = false;
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    
    if (navigation) {
      navigation.goBack();
    } else {
      Alert.alert('Kembali', 'Fungsi kembali akan mengarahkan ke halaman sebelumnya');
    }
  };

  const getFrameColor = () => {
    if (!faceDetected && detectionStatus !== 'idle') {
      return '#F44336';
    }
    
    switch (detectionStatus) {
      case 'idle': return faceDetected ? '#4CAF50' : '#FFF';
      case 'ready': return '#FFD700';
      case 'action': return '#2196F3';
      case 'success': return '#4CAF50';
      case 'failed': return '#F44336';
      default: return '#FFFFFF';
    }
  };

  const getStatusText = () => {
    if (!faceDetected && detectionStatus !== 'idle') {
      return 'Wajah tidak terdeteksi!';
    }
    
    switch (detectionStatus) {
      case 'idle': 
        if (!faceDetected) {
          return 'Posisikan wajah dalam frame';
        }
        return 'Wajah terdeteksi - Siap memulai';
      case 'ready': return `Bersiap... ${countdown}`;
      case 'action': return currentAction?.instruction || 'Lakukan instruksi';
      case 'success': return 'Liveness detection berhasil!';
      case 'failed': return 'Deteksi gagal';
      default: return 'Posisikan wajah dalam frame';
    }
  };

  const getSubtitleText = () => {
    if (!faceDetected && detectionStatus !== 'idle') {
      return 'Pastikan wajah tetap terlihat dalam frame';
    }
    
    switch (detectionStatus) {
      case 'idle': 
        if (!faceDetected) {
          return `Stabilitas: ${Math.round(faceStability * 100)}%`;
        }
        return 'Tekan tombol untuk memulai liveness detection';
      case 'ready': return 'Jangan bergerak, segera dimulai...';
      case 'action': return `${actionCountdown}s - Ikuti instruksi dengan natural`;
      case 'success': return 'Presensi akan segera disimpan';
      case 'failed': return 'Silakan coba lagi';
      default: return 'Pastikan wajah terlihat jelas dan terang';
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
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera */}
      <Camera 
        style={StyleSheet.absoluteFill} 
        device={device} 
        isActive={true}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Presensi Liveness</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Face Detection Status Indicator */}
      <View style={styles.faceStatusContainer}>
        <View style={[styles.faceStatusDot, { 
          backgroundColor: faceDetected ? '#4CAF50' : '#F44336' 
        }]} />
        <Text style={styles.faceStatusText}>
          {faceDetected ? 'Wajah Terdeteksi' : 'Mencari Wajah...'}
        </Text>
      </View>

      {/* Face Detection Overlay - HANYA TAMPIL JIKA WAJAH TERDETEKSI */}
      <View style={styles.overlay}>
        {faceDetected && (
          <Animated.View
            style={[
              styles.faceFrame,
              {
                transform: [{ scale: animatedValue }],
                borderColor: getFrameColor(),
                opacity: fadeAnim,
              },
            ]}
          >
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft, { borderColor: getFrameColor() }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: getFrameColor() }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: getFrameColor() }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: getFrameColor() }]} />
          </Animated.View>
        )}
      </View>

      {/* Action Instruction with Icon */}
      {currentAction && (
        <View style={styles.actionContainer}>
          <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
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
                    backgroundColor: index < currentStep 
                      ? '#4CAF50' 
                      : index === currentStep && detectionStatus === 'action'
                      ? '#2196F3'
                      : 'rgba(255, 255, 255, 0.3)'
                  }
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>
          {getStatusText()}
        </Text>
        <Text style={styles.instructionSubtitle}>
          {getSubtitleText()}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {!isDetecting && detectionStatus !== 'success' && (
          <TouchableOpacity
            style={[
              styles.captureButton,
              detectionStatus === 'failed' && styles.retryButton,
              !faceDetected && styles.disabledButton
            ]}
            onPress={startLivenessDetection}
            disabled={!faceDetected}
          >
            <Icon 
              name={detectionStatus === 'failed' ? 'refresh' : 'security'} 
              size={32} 
              color="white" 
            />
            <Text style={styles.captureButtonText}>
              {detectionStatus === 'failed' ? 'Coba Lagi' : 'Mulai Liveness Detection'}
            </Text>
          </TouchableOpacity>
        )}

        {detectionStatus === 'success' && (
          <View style={styles.successContainer}>
            <Icon name="verified" size={48} color="#4CAF50" />
            <Text style={styles.successText}>Liveness Verified!</Text>
          </View>
        )}

        {/* Info about liveness detection */}
        {detectionStatus === 'idle' && (
          <View style={styles.infoContainer}>
            <Icon name="info" size={20} color="#FFD700" />
            <Text style={styles.infoText}>
              {faceDetected 
                ? 'Anda akan diminta melakukan 3 gerakan acak untuk memastikan ini wajah asli'
                : 'Pastikan wajah terlihat jelas dalam frame sebelum memulai'
              }
            </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
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
  faceStatusContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight + 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  faceStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  faceStatusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  faceFrame: {
    width: width * 0.7,
    height: width * 0.85,
    borderWidth: 3,
    borderRadius: 20,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  topLeft: {
    top: -3,
    left: -3,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: -3,
    right: -3,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderBottomRightRadius: 20,
  },
  actionContainer: {
    position: 'absolute',
    top: height * 0.25,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 50,
    padding: 20,
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
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
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
    top: height * 0.75,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
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
    left: 0,
    right: 0,
    alignItems: 'center',
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
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 20,
    marginTop: 15,
    maxWidth: width - 40,
  },
  infoText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
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

export { CameraScreen };