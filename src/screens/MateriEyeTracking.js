// MateriEyeTracking.js - Fixed Camera Position
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  BackHandler,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const { width, height } = Dimensions.get('window');

export default function MateriEyeTracking({ route, navigation }) {
  const { materi } = route.params;

  const [isTracking, setIsTracking] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isLoadingPermission, setIsLoadingPermission] = useState(true);
  const [trackingData, setTrackingData] = useState({
    totalTime: 0,
    focusTime: 0,
    distractionCount: 0,
    attentionScore: 100,
    eyeMovements: [],
  });
  const [currentFocus, setCurrentFocus] = useState(true);
  const [isSimulatingEyeTracking, setIsSimulatingEyeTracking] = useState(false);

  const device = useCameraDevice('front');
  const trackingInterval = useRef(null);
  const lastFocusTime = useRef(Date.now());
  const startTime = useRef(Date.now());

  // Data konten materi berdasarkan ID
  const getMateriContent = materiId => {
    const contents = {
      1: {
        title: 'Game Design Fundamentals',
        sections: [
          {
            title: 'Apa itu Game Design?',
            content:
              'Game Design adalah proses kreatif dalam merancang konten dan aturan permainan. Seorang game designer bertanggung jawab untuk menciptakan pengalaman bermain yang menyenangkan dan engaging bagi para pemain.\n\nGame designer harus memahami psikologi pemain, mekanik gameplay yang menyenangkan, dan cara menciptakan tantangan yang seimbang.',
          },
          {
            title: 'Elemen Utama Game Design',
            content: `1. Core Mechanics
• Player Actions - Apa yang bisa dilakukan pemain
• Game Rules - Aturan yang mengatur permainan  
• Win/Lose Conditions - Kondisi menang atau kalah
• Progression System - Sistem kemajuan pemain

2. Game Systems
• Economy System - Sistem ekonomi dalam game
• Leveling System - Sistem level dan pengalaman
• Combat System - Sistem pertarungan atau konflik
• Reward System - Sistem hadiah dan achievement

3. User Experience (UX)
• Interface Design - Desain antarmuka yang intuitif
• Feedback Systems - Sistem umpan balik untuk pemain
• Learning Curve - Kurva pembelajaran yang tepat
• Accessibility - Kemudahan akses untuk semua pemain`,
          },
          {
            title: 'Prinsip Game Design',
            content: `Player-Centered Design: Semua keputusan design harus berpusat pada pengalaman pemain. Pertanyaan utama: "Apakah ini menyenangkan untuk pemain?"

Meaningful Choices: Berikan pemain pilihan yang bermakna dan berdampak pada gameplay. Setiap keputusan harus memiliki konsekuensi.

Clear Goals: Pemain harus selalu tahu apa yang harus mereka lakukan selanjutnya. Tujuan harus jelas dan dapat dicapai.

Balanced Challenge: Game harus challenging tapi tidak frustrating. Tingkat kesulitan harus seimbang dengan kemampuan pemain.

Flow State: Ciptakan kondisi dimana pemain benar-benar tenggelam dalam permainan (flow state).`,
          },
          {
            title: 'Tools dan Prototyping',
            content: `Game Design Tools:
• Game Engines: Unity, Unreal Engine, Godot
• Prototyping Tools: Figma, Adobe XD, Balsamiq
• Documentation: Notion, Confluence, Google Docs
• Version Control: Git, Perforce

Prototyping Process:
1. Paper Prototype - Konsep awal di atas kertas
2. Digital Mockup - Wireframe dan UI mockup
3. Playable Prototype - Versi yang bisa dimainkan
4. Vertical Slice - Sebagian kecil yang representatif
5. Alpha Build - Fitur lengkap tapi masih bug
6. Beta Build - Siap untuk testing eksternal`,
          },
        ],
      },
      2: {
        title: 'React Native Development Setup',
        sections: [
          {
            title: 'Setup Environment React Native',
            content: `React Native adalah framework untuk membuat aplikasi mobile menggunakan React. Untuk memulai, kita perlu setup development environment yang tepat.

Kebutuhan System:
• Node.js (versi 16 atau lebih tinggi)
• Java Development Kit (JDK 11 atau 17)
• Android Studio untuk Android development
• Xcode untuk iOS development (Mac only)
• React Native CLI atau Expo CLI`,
          },
          {
            title: 'Instalasi React Native CLI',
            content: `Langkah-langkah instalasi:

1. Install Node.js dari nodejs.org
2. Install React Native CLI:
   npm install -g @react-native-community/cli

3. Install Android Studio:
   - Download dari developer.android.com
   - Install Android SDK (API 30+)
   - Setup Android Virtual Device (AVD)
   - Configure ANDROID_HOME environment variable

4. Setup Environment Variables:
   - ANDROID_HOME: path ke Android SDK
   - JAVA_HOME: path ke JDK
   - Update PATH untuk include Android tools`,
          },
          {
            title: 'Membuat Project Baru',
            content: `Untuk membuat project React Native baru:

npx react-native@latest init MyFirstApp
cd MyFirstApp
npx react-native run-android

Struktur Folder:
• android/ - Kode native Android
• ios/ - Kode native iOS  
• src/ - Source code JavaScript/TypeScript
• App.js - Main component
• package.json - Dependencies dan scripts
• metro.config.js - Metro bundler configuration
• babel.config.js - Babel configuration`,
          },
          {
            title: 'Development Workflow',
            content: `Development Best Practices:

1. Hot Reloading
   - Fast Refresh untuk perubahan real-time
   - Hot reload untuk state preservation

2. Debugging Tools
   - React Developer Tools
   - Flipper untuk debugging native
   - Chrome DevTools untuk JavaScript

3. Testing Strategy
   - Unit testing dengan Jest
   - Integration testing
   - E2E testing dengan Detox

4. Performance Monitoring
   - Monitor bundle size
   - Profiling dengan Hermes
   - Memory leak detection`,
          },
        ],
      },
      3: {
        title: 'Algoritma dan Struktur Data',
        sections: [
          {
            title: 'Pengenalan Algoritma',
            content: `Algoritma adalah langkah-langkah logis yang disusun secara sistematis untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.

Karakteristik Algoritma:
• Input - Data masukan yang diperlukan
• Output - Hasil yang diharapkan
• Definiteness - Setiap langkah harus jelas dan tidak ambigu
• Finiteness - Algoritma harus berakhir dalam waktu terbatas
• Effectiveness - Setiap operasi harus dapat dilakukan

Representasi Algoritma:
• Pseudocode - Deskripsi informal menggunakan bahasa natural
• Flowchart - Diagram alur visual
• Code - Implementasi dalam bahasa pemrograman`,
          },
          {
            title: 'Struktur Data Fundamental',
            content: `Array: Struktur data yang menyimpan elemen dalam urutan tertentu
• Akses elemen: O(1)
• Pencarian: O(n)
• Insertion/Deletion: O(n)

Linked List: Struktur data linear dengan pointer
• Insertion/Deletion: O(1) di head
• Akses elemen: O(n)
• Dynamic size

Stack: Struktur data LIFO (Last In, First Out)
• Push: menambah elemen di atas - O(1)
• Pop: menghapus elemen teratas - O(1)
• Peek/Top: melihat elemen teratas - O(1)

Queue: Struktur data FIFO (First In, First Out)
• Enqueue: menambah elemen di belakang - O(1)
• Dequeue: menghapus elemen di depan - O(1)
• Front: melihat elemen terdepan - O(1)`,
          },
          {
            title: 'Analisis Kompleksitas',
            content: `Big O Notation menganalisis efisiensi algoritma:

O(1) - Constant Time
• Akses array dengan indeks
• Push/pop stack
• Hash table lookup (average case)

O(log n) - Logarithmic Time  
• Binary search pada array terurut
• Tree operations (balanced tree)
• Divide and conquer algorithms

O(n) - Linear Time
• Linear search
• Array traversal
• Single loop iteration

O(n log n) - Linearithmic Time
• Efficient sorting (merge sort, heap sort)
• Building heap from array

O(n²) - Quadratic Time
• Bubble sort, selection sort
• Nested loops over same data
• Naive matrix multiplication

O(2ⁿ) - Exponential Time
• Recursive fibonacci (naive)
• Subset generation
• Tower of Hanoi`,
          },
          {
            title: 'Algoritma Sorting',
            content: `Bubble Sort - O(n²)
• Sederhana tapi tidak efisien
• Membandingkan elemen bersebelahan
• Cocok untuk data kecil

Selection Sort - O(n²)
• Mencari elemen minimum/maximum
• Swap dengan posisi yang tepat
• In-place sorting

Insertion Sort - O(n²) worst, O(n) best
• Efisien untuk data hampir terurut
• Online algorithm (dapat memproses data streaming)
• Adaptive sorting

Merge Sort - O(n log n)
• Divide and conquer approach
• Stable sorting algorithm
• Membutuhkan extra space O(n)

Quick Sort - O(n log n) average, O(n²) worst
• In-place sorting
• Pivot selection mempengaruhi performance
• Tidak stable tapi sangat cepat rata-rata`,
          },
        ],
      },
      4: {
        title: 'UI/UX Design Principles',
        sections: [
          {
            title: 'Fundamental UI Design',
            content: `User Interface (UI) Design berfokus pada tampilan visual dan interaksi pengguna dengan produk digital.

Prinsip Dasar UI:
• Clarity - Antarmuka harus jelas dan mudah dipahami
• Consistency - Konsistensi dalam elemen dan pola design
• Familiarity - Menggunakan konvensi yang sudah dikenal user
• Responsiveness - Memberikan feedback untuk setiap aksi user
• Efficiency - Memungkinkan user menyelesaikan tugas dengan cepat

Visual Hierarchy:
• Size - Elemen penting lebih besar
• Color - Kontras untuk menarik perhatian
• Typography - Font weight dan style
• Spacing - White space untuk grouping
• Position - Placement yang strategis`,
          },
          {
            title: 'User Experience (UX) Fundamentals',
            content: `UX Design berfokus pada keseluruhan pengalaman pengguna saat menggunakan produk.

UX Design Process:
1. Research - User interviews, surveys, analytics
2. Empathy - User personas dan journey mapping  
3. Define - Problem statement dan requirements
4. Ideate - Brainstorming dan concept generation
5. Prototype - Low-fi sampai high-fi prototypes
6. Test - Usability testing dan iteration

Elemen UX Design:
• User Research - Memahami kebutuhan dan perilaku user
• Information Architecture - Struktur dan organisasi konten
• Wireframing - Sketsa layout dan struktur halaman
• Prototyping - Model interaktif untuk testing
• Usability Testing - Menguji kemudahan penggunaan produk`,
          },
          {
            title: 'Design System & Components',
            content: `Design System adalah kumpulan reusable components dan guidelines yang memastikan konsistensi design.

Komponen Design System:
• Color Palette - Primary, secondary, neutral colors
• Typography Scale - Heading, body, caption styles
• Spacing System - 4pt atau 8pt grid system
• Component Library - Buttons, forms, cards, modals
• Icon System - Consistent iconography style
• Grid System - Layout dan responsive behavior

Atomic Design Methodology:
• Atoms - Basic building blocks (buttons, inputs)
• Molecules - Simple groups of atoms (search form)
• Organisms - Complex components (header, sidebar)
• Templates - Page layout structures
• Pages - Specific instances of templates

Benefits:
• Consistency across products
• Faster development cycle
• Better collaboration
• Easier maintenance
• Scalable design language`,
          },
          {
            title: 'Mobile-First Design',
            content: `Mobile-First adalah pendekatan design yang dimulai dari mobile device kemudian scale up ke desktop.

Mobile Design Considerations:
• Touch Targets - Minimum 44px untuk tap area
• Thumb Zone - Area yang mudah dijangkau thumb
• Loading States - Progressive loading untuk koneksi lambat
• Offline States - Graceful degradation tanpa internet
• Performance - Optimize untuk device dengan resource terbatas

Responsive Design Principles:
• Flexible Grid Systems - Using percentages, not pixels
• Flexible Images - Scale dengan container
• Media Queries - Breakpoints untuk different screen sizes
• Progressive Enhancement - Start basic, add features
• Content Priority - Most important content first

iOS vs Android Guidelines:
• iOS Human Interface Guidelines (HIG)
• Material Design untuk Android
• Platform-specific patterns dan behaviors
• Native vs cross-platform considerations`,
          },
        ],
      },
    };

    return contents[materiId] || contents[1];
  };

  const materiContent = getMateriContent(materi.id);

  useEffect(() => {
    initializePermissions();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBackPress();
        return true;
      },
    );

    return () => {
      backHandler.remove();
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, []);

  const initializePermissions = async () => {
    setIsLoadingPermission(true);

    try {
      // Check camera permission directly
      const cameraPermissionStatus = await Camera.getCameraPermissionStatus();
      console.log('Camera permission status:', cameraPermissionStatus);

      if (
        cameraPermissionStatus === 'granted' ||
        cameraPermissionStatus === 'authorized'
      ) {
        setCameraPermission(true);
        startTracking();
      } else if (cameraPermissionStatus === 'not-determined') {
        // Request permission
        const newPermissionStatus = await Camera.requestCameraPermission();
        console.log('New permission status:', newPermissionStatus);

        if (
          newPermissionStatus === 'granted' ||
          newPermissionStatus === 'authorized'
        ) {
          setCameraPermission(true);
          startTracking();
        } else {
          setCameraPermission(false);
          setIsSimulatingEyeTracking(true);
          startTracking();
        }
      } else {
        // Permission denied, use simulation
        setCameraPermission(false);
        setIsSimulatingEyeTracking(true);
        startTracking();
      }
    } catch (error) {
      console.error('Permission initialization error:', error);
      setCameraPermission(false);
      setIsSimulatingEyeTracking(true);
      startTracking();
    } finally {
      setIsLoadingPermission(false);
    }
  };

  const handleRequestPermission = async () => {
    setIsLoadingPermission(true);

    try {
      const permissionStatus = await Camera.requestCameraPermission();
      console.log('Permission request result:', permissionStatus);

      if (permissionStatus === 'granted' || permissionStatus === 'authorized') {
        setCameraPermission(true);
        setIsSimulatingEyeTracking(false);
        // Restart tracking with camera
        startTracking();
      } else {
        // Show alert to go to settings
        Alert.alert(
          'Izin Kamera Diperlukan',
          'Untuk menggunakan eye tracking yang akurat, mohon aktifkan izin kamera di pengaturan aplikasi.',
          [
            { text: 'Nanti Saja', style: 'cancel' },
            {
              text: 'Buka Pengaturan',
              onPress: () => {
                // Open app settings
                Linking.openSettings();
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    } finally {
      setIsLoadingPermission(false);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    startTime.current = Date.now();
    lastFocusTime.current = Date.now();

    // Start simulated eye tracking if no camera permission
    if (isSimulatingEyeTracking || !cameraPermission) {
      startSimulatedTracking();
    }
  };

  const startSimulatedTracking = () => {
    trackingInterval.current = setInterval(() => {
      // Simulate eye tracking with random focus/unfocus
      const randomFocus = Math.random() > 0.25; // 75% chance of being focused
      setCurrentFocus(randomFocus);
      updateTrackingData(randomFocus);
    }, 1000);
  };

  const updateTrackingData = isFocused => {
    const now = Date.now();

    setTrackingData(prev => {
      const newData = { ...prev };
      newData.totalTime += 1;

      if (isFocused) {
        newData.focusTime += 1;
      } else {
        if (currentFocus === true) {
          newData.distractionCount += 1;
        }
      }

      newData.attentionScore =
        newData.totalTime > 0
          ? Math.round((newData.focusTime / newData.totalTime) * 100)
          : 100;

      // Store eye movement data
      newData.eyeMovements.push({
        timestamp: now,
        focused: isFocused,
        simulated: isSimulatingEyeTracking || !cameraPermission,
      });

      return newData;
    });
  };

  const handleBackPress = () => {
    setIsTracking(false);

    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
    }

    // Calculate final session data
    const sessionDuration = Math.floor((Date.now() - startTime.current) / 1000);
    const finalData = {
      materiId: materi.id,
      materiTitle: materi.title,
      studentId: 'student_123', // This would come from user context
      sessionStart: new Date(startTime.current).toISOString(),
      sessionEnd: new Date().toISOString(),
      sessionDuration,
      trackingMode: cameraPermission ? 'camera' : 'simulated',
      ...trackingData,
    };

    // Here you would save to database
    console.log('Saving tracking data:', finalData);

    Alert.alert(
      'Sesi Pembelajaran Selesai',
      `${materi.title}\n\nWaktu belajar: ${formatTime(
        trackingData.totalTime,
      )}\nWaktu fokus: ${formatTime(trackingData.focusTime)}\nSkor perhatian: ${
        trackingData.attentionScore
      }%\nGangguan: ${trackingData.distractionCount}x${
        !cameraPermission
          ? '\n\n*Mode simulasi - untuk tracking akurat, berikan izin kamera'
          : ''
      }`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAttentionColor = score => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getAttentionText = score => {
    if (score >= 80) return 'Sangat Baik';
    if (score >= 60) return 'Baik';
    return 'Perlu Peningkatan';
  };

  if (isLoadingPermission) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Mempersiapkan Eye Tracking...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header dengan tracking info */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>

          <View style={styles.trackingInfo}>
            <View
              style={[
                styles.focusIndicator,
                {
                  backgroundColor: currentFocus ? '#10B981' : '#EF4444',
                },
              ]}
            >
              <Text style={styles.focusText}>
                {currentFocus ? '👁 Fokus' : '👁 Tidak Fokus'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.materiHeader}>
          <Text style={styles.materiTitle}>{materi.title}</Text>
          <Text style={styles.materiSubtitle}>{materi.subtitle}</Text>
        </View>

        {/* Camera container fixed di dalam header */}
        <View style={styles.cameraContainer}>
          {cameraPermission && device && (
            <Camera
              style={styles.camera}
              device={device}
              isActive={isTracking}
              // Note: Face detection will be implemented with ML Kit separately
            />
          )}

          {/* Simulated camera view */}
          {(!cameraPermission || isSimulatingEyeTracking) && (
            <View style={styles.simulatedCamera}>
              <Text style={styles.simulatedCameraText}>📹</Text>
              <Text style={styles.simulatedLabel}>Simulasi</Text>
            </View>
          )}
        </View>

        {/* Permission button di bawah camera */}
        {!cameraPermission && (
          <TouchableOpacity
            onPress={handleRequestPermission}
            style={styles.permissionButton}
            disabled={isLoadingPermission}
          >
            <Text style={styles.permissionButtonText}>
              {isLoadingPermission ? 'Loading...' : 'Aktifkan Kamera'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {materiContent.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Stats panel tetap di bawah */}
      <View style={styles.statsPanel}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>
            Live Tracking{' '}
            {(!cameraPermission || isSimulatingEyeTracking) && '(Simulasi)'}
          </Text>
          <Text style={styles.timeText}>
            ⏱ {formatTime(trackingData.totalTime)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Fokus</Text>
            <Text style={styles.statValue}>
              {formatTime(trackingData.focusTime)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gangguan</Text>
            <Text style={styles.statValue}>
              {trackingData.distractionCount}x
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Skor</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color: getAttentionColor(trackingData.attentionScore),
                },
              ]}
            >
              {trackingData.attentionScore}%
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            Tingkat Perhatian: {getAttentionText(trackingData.attentionScore)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${trackingData.attentionScore}%`,
                  backgroundColor: getAttentionColor(
                    trackingData.attentionScore,
                  ),
                },
              ]}
            />
          </View>
        </View>

        {!cameraPermission && (
          <View style={styles.infoNote}>
            <Text style={styles.infoNoteText}>
              💡 Mode simulasi aktif. Berikan izin kamera untuk eye tracking
              yang akurat.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  focusText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  materiHeader: {
    marginBottom: 15,
  },
  materiTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  materiSubtitle: {
    color: '#E0E7FF',
    fontSize: 14,
  },
  // Fixed camera container styling
  cameraContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 100,
    height: 75,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  simulatedCamera: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulatedCameraText: {
    fontSize: 24,
  },
  simulatedLabel: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: 'bold',
  },
  permissionButton: {
    position: 'absolute',
    top: 145, // Below camera
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  bottomPadding: {
    height: 20,
  },
  statsPanel: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  timeText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  infoNote: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginTop: 8,
  },
  infoNoteText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
});
