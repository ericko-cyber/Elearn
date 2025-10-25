import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { scanFaces } from 'react-native-vision-camera-face-detector';
import { runOnJS } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Konfigurasi guide oval
const OVAL_WIDTH = 280;
const OVAL_HEIGHT = 360;
const OVAL_LEFT = (SCREEN_WIDTH - OVAL_WIDTH) / 2;
const OVAL_TOP = (SCREEN_HEIGHT - OVAL_HEIGHT) / 2 - 80;

const TrainingFace = ({ navigation }) => {
  const [step, setStep] = useState('info'); // 'info' atau 'camera'
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isFaceAligned, setIsFaceAligned] = useState(false);
  const [faces, setFaces] = useState([]);
  const [validationMessage, setValidationMessage] = useState('Mencari wajah...');
  
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');

  // Request camera permission
  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Izin Kamera',
            message: 'Aplikasi memerlukan akses kamera untuk mengambil foto wajah Anda',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Tolak',
            buttonPositive: 'Izinkan',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'granted');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Fungsi untuk validasi posisi wajah
  const checkFaceAlignment = (detectedFaces) => {
    if (detectedFaces.length === 0) {
      setIsFaceAligned(false);
      setValidationMessage('Tidak ada wajah terdeteksi');
      return;
    }

    if (detectedFaces.length > 1) {
      setIsFaceAligned(false);
      setValidationMessage('Terdeteksi lebih dari 1 wajah');
      return;
    }

    const face = detectedFaces[0];
    const faceBounds = face.bounds;

    // Toleransi validasi (pixel)
    const TOLERANCE = 60;

    // Posisi wajah
    const faceLeft = faceBounds.x;
    const faceTop = faceBounds.y;
    const faceRight = faceBounds.x + faceBounds.width;
    const faceBottom = faceBounds.y + faceBounds.height;
    const faceCenterX = faceLeft + (faceBounds.width / 2);
    const faceCenterY = faceTop + (faceBounds.height / 2);

    // Posisi guide
    const guideCenterX = OVAL_LEFT + (OVAL_WIDTH / 2);
    const guideCenterY = OVAL_TOP + (OVAL_HEIGHT / 2);

    // Validasi posisi horizontal
    const isHorizontallyAligned = Math.abs(faceCenterX - guideCenterX) < TOLERANCE;
    
    // Validasi posisi vertikal
    const isVerticallyAligned = Math.abs(faceCenterY - guideCenterY) < TOLERANCE;

    // Validasi ukuran wajah
    const minFaceWidth = OVAL_WIDTH * 0.55;
    const maxFaceWidth = OVAL_WIDTH * 0.95;
    const isSizeAppropriate = 
      faceBounds.width >= minFaceWidth && 
      faceBounds.width <= maxFaceWidth;

    // Validasi wajah di dalam boundary guide
    const isInsideBounds = 
      faceLeft >= OVAL_LEFT - TOLERANCE &&
      faceRight <= OVAL_LEFT + OVAL_WIDTH + TOLERANCE &&
      faceTop >= OVAL_TOP - TOLERANCE &&
      faceBottom <= OVAL_TOP + OVAL_HEIGHT + TOLERANCE;

    // Tentukan pesan validasi
    if (!isSizeAppropriate) {
      if (faceBounds.width < minFaceWidth) {
        setValidationMessage('Wajah terlalu jauh, dekati kamera');
      } else {
        setValidationMessage('Wajah terlalu dekat, jauhkan kamera');
      }
      setIsFaceAligned(false);
      return;
    }

    if (!isHorizontallyAligned) {
      setValidationMessage('Geser ke ' + (faceCenterX < guideCenterX ? 'kanan' : 'kiri'));
      setIsFaceAligned(false);
      return;
    }

    if (!isVerticallyAligned) {
      setValidationMessage('Geser ke ' + (faceCenterY < guideCenterY ? 'bawah' : 'atas'));
      setIsFaceAligned(false);
      return;
    }

    if (!isInsideBounds) {
      setValidationMessage('Posisikan wajah di dalam oval');
      setIsFaceAligned(false);
      return;
    }

    // Semua validasi passed
    setValidationMessage('✓ Posisi sempurna! Tekan tombol untuk capture');
    setIsFaceAligned(true);
  };

  // Frame processor untuk deteksi wajah real-time
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const detectedFaces = scanFaces(frame, {
        performanceMode: 'fast',
        landmarkMode: 'none',
        contourMode: 'none',
      });
      
      runOnJS(setFaces)(detectedFaces);
      runOnJS(checkFaceAlignment)(detectedFaces);
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }, []);

  const handleStartCapture = async () => {
    if (!hasPermission) {
      await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Izin Kamera Diperlukan',
          'Aplikasi memerlukan izin kamera untuk mengambil foto wajah Anda.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    if (!device) {
      Alert.alert('Error', 'Kamera tidak tersedia');
      return;
    }

    setStep('camera');
    console.log('Membuka kamera...');
  };

  const handleCapture = async () => {
    // PENTING: Tombol hanya bisa diklik jika wajah sudah aligned
    if (!isFaceAligned) {
      Alert.alert(
        'Posisi Belum Tepat',
        'Pastikan wajah Anda berada tepat di dalam guide oval sebelum mengambil foto.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (cameraRef.current) {
      try {
        console.log('Mengambil foto...');
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          flash: 'off',
        });
        
        setCapturedPhoto(photo);
        setIsCaptured(true);
        console.log('Foto berhasil diambil:', photo.path);
        
        Alert.alert(
          'Foto Berhasil!',
          'Wajah Anda telah berhasil diambil. Simpan data untuk training?',
          [
            {
              text: 'Ambil Ulang',
              style: 'cancel',
              onPress: () => {
                setIsCaptured(false);
                setCapturedPhoto(null);
                setIsFaceAligned(false);
              }
            },
            {
              text: 'Simpan',
              onPress: () => handleSave()
            }
          ]
        );
      } catch (error) {
        console.error('Error mengambil foto:', error);
        Alert.alert('Error', 'Gagal mengambil foto. Silakan coba lagi.');
      }
    }
  };

  const handleSave = () => {
    console.log('Menyimpan data training...');
    console.log('Photo Path:', capturedPhoto?.path);
    
    Alert.alert(
      'Sukses', 
      'Data wajah berhasil disimpan! Foto akan digunakan untuk training sistem.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleBack = () => {
    if (step === 'camera') {
      Alert.alert(
        'Kembali',
        'Apakah Anda yakin ingin kembali ke halaman informasi?',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Ya',
            onPress: () => {
              setStep('info');
              setIsCaptured(false);
              setCapturedPhoto(null);
              setIsFaceAligned(false);
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // STEP 1: Informasi
  if (step === 'info') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Kembali</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Training Wajah</Text>
            <Text style={styles.subtitle}>
              Persiapan sebelum mengambil foto wajah
            </Text>
          </View>

          <View style={styles.illustrationContainer}>
            <Text style={styles.illustrationIcon}>🎯</Text>
            <Text style={styles.illustrationText}>
              Foto wajah Anda akan digunakan untuk training sistem face recognition
            </Text>
          </View>

          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>📋 Petunjuk Pengambilan Foto:</Text>
            
            <View style={styles.instructionItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>Pencahayaan</Text>
                <Text style={styles.instructionText}>
                  Pastikan ruangan memiliki pencahayaan yang cukup
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>2</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>Posisi Wajah</Text>
                <Text style={styles.instructionText}>
                  Hadapkan wajah langsung ke kamera dengan jelas
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>3</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>Tanpa Penghalang</Text>
                <Text style={styles.instructionText}>
                  Lepaskan kacamata, masker, atau topi jika memungkinkan
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>4</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>Ekspresi Netral</Text>
                <Text style={styles.instructionText}>
                  Gunakan ekspresi wajah yang natural dan rileks
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsIcon}>💡</Text>
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Tips untuk hasil terbaik:</Text>
              <Text style={styles.tipsText}>
                • Pastikan seluruh wajah terlihat dalam frame{'\n'}
                • Hindari bayangan yang menutupi wajah{'\n'}
                • Jaga jarak yang tepat dari kamera{'\n'}
                • Foto dalam kondisi yang tenang
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartCapture}
          >
            <Text style={styles.startButtonText}>📸 Mulai Capture Wajah</Text>
          </TouchableOpacity>

          <View style={styles.infoFooter}>
            <Text style={styles.infoFooterText}>
              ℹ️ Data wajah Anda akan tersimpan dengan aman dan hanya digunakan untuk sistem presensi
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // STEP 2: Camera
  if (!device) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Kamera tidak tersedia</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => setStep('info')}
          >
            <Text style={styles.errorButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.cameraContainer}>
      
      <View style={styles.cameraHeader}>
        <TouchableOpacity 
          style={styles.cameraBackButton}
          onPress={handleBack}
        >
          <Text style={styles.cameraBackButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.cameraTitle}>Ambil Foto Wajah</Text>
        <View style={styles.placeholder} />
      </View>

      {!isCaptured ? (
        <View style={styles.cameraPreview}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={step === 'camera' && !isCaptured}
            photo={true}
            frameProcessor={frameProcessor}
          />
          
          {/* Overlay dengan guide oval */}
          <View style={styles.faceOverlay}>
            <View 
              style={[
                styles.faceGuide,
                isFaceAligned && styles.faceGuideAligned
              ]}
            >
              {/* Corner indicators */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            
            {/* Validation message */}
            <View style={[
              styles.validationBox,
              isFaceAligned && styles.validationBoxAligned
            ]}>
              <Text style={styles.validationText}>
                {validationMessage}
              </Text>
            </View>
          </View>

          {/* Info box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              Wajah terdeteksi: {faces.length}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.capturedPreview}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.capturedText}>Foto Berhasil Diambil</Text>
        </View>
      )}

      <View style={styles.cameraInstructions}>
        <Text style={styles.cameraInstructionText}>
          {!isCaptured 
            ? 'Posisikan wajah di dalam oval hingga menjadi hijau' 
            : 'Foto berhasil! Simpan atau ambil ulang'
          }
        </Text>
      </View>

      <View style={styles.cameraActions}>
        {!isCaptured ? (
          <View style={styles.captureButtonContainer}>
            {/* TOMBOL CAPTURE - Hanya aktif jika isFaceAligned = true */}
            <TouchableOpacity 
              style={[
                styles.captureButton,
                !isFaceAligned && styles.captureButtonDisabled
              ]}
              onPress={handleCapture}
              disabled={!isFaceAligned}  // ← KUNCI UTAMA: disabled jika wajah belum aligned
            >
              <View style={[
                styles.captureButtonInner,
                isFaceAligned && styles.captureButtonInnerActive
              ]} />
            </TouchableOpacity>
            <Text style={styles.captureHint}>
              {isFaceAligned ? 'Tekan untuk capture' : 'Sejajarkan wajah terlebih dahulu'}
            </Text>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={() => {
                setIsCaptured(false);
                setCapturedPhoto(null);
                setIsFaceAligned(false);
              }}
            >
              <Text style={styles.retakeButtonText}>🔄 Ambil Ulang</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>💾 Simpan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  illustrationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  illustrationIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  illustrationText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#3498DB',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  infoFooter: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  infoFooterText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1,
  },
  cameraBackButton: {
    padding: 8,
  },
  cameraBackButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: OVAL_WIDTH / 2,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  faceGuideAligned: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 15,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 15,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 15,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 15,
  },
  validationBox: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  validationBoxAligned: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: '#10B981',
  },
  validationText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoBoxText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  capturedPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  checkIcon: {
    fontSize: 100,
    color: '#10B981',
    marginBottom: 20,
  },
  capturedText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cameraInstructions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cameraInstructionText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  cameraActions: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  captureButtonDisabled: {
    opacity: 0.3,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#64748B',
  },
  captureButtonInnerActive: {
    backgroundColor: '#10B981',
  },
  captureHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#64748B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#3498DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TrainingFace;