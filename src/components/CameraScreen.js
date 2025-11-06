import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://192.168.137.198:8000'; // ganti IP sesuai server FastAPI kamu


export default function CameraScreen() {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFace, setDetectedFace] = useState(null);
  const [autoCapture, setAutoCapture] = useState(true);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // Ambil foto dan kirim ke server FastAPI
  const captureAndDetect = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
      });

      const formData = new FormData();
      formData.append('file', {
        uri: 'file://' + photo.path,
        type: 'image/jpeg',
        name: 'frame.jpg',
      });

      // kirim ke /recognize/
      const res = await axios.post(`${API_URL}/recognize/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        if (res.data.recognized && res.data.recognized.length > 0) {
          setDetectedFace(`Dikenali: ${res.data.recognized[0].username}`);
        } else {
          setDetectedFace('Wajah terdeteksi tapi tidak dikenali');
        }
      } else {
        setDetectedFace('Tidak ada wajah terdeteksi');
      }
    } catch (err) {
      console.log(err);
      setDetectedFace('Gagal mendeteksi wajah');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  // Auto ambil gambar tiap beberapa detik
  useEffect(() => {
    let interval;
    if (autoCapture) {
      interval = setInterval(() => {
        captureAndDetect();
      }, 5000); // ambil gambar tiap 5 detik
    }
    return () => clearInterval(interval);
  }, [autoCapture, captureAndDetect]);

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Kamera tidak ditemukan</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Memerlukan izin kamera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={{ color: '#fff' }}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.statusText}>
          {detectedFace ? detectedFace : 'Arahkan wajah Anda ke kamera'}
        </Text>
        {isProcessing && <ActivityIndicator color="#00f" size="large" style={{ marginTop: 10 }} />}
      </View>

      {/* Tombol Manual */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          onPress={captureAndDetect}
          style={[styles.captureBtn, isProcessing && { backgroundColor: '#666' }]}
          disabled={isProcessing}
        >
          <Icon name="camera-alt" size={28} color="white" />
          <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 10 }}>Scan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// === STYLE ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    position: 'absolute',
    bottom: 150,
    width: '100%',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  permissionBtn: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
});
