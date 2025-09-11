import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Alert, TextInput, ScrollView, ImageBackground } from 'react-native'
import React, { useState } from 'react'

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    nama: 'Rafi Ramdani Dinata',
    kelas: 'GOLONGAN A TIF PAJ',
    noAbsen: '12',
    nim: '2023001234'
  });

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Apakah Anda yakin ingin keluar dari aplikasi?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => console.log("User logged out") }
      ]
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ac0505ffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Siswa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section dengan Background */}
        <ImageBackground 
          source={{ uri: "https://picsum.photos/500/300" }} 
          style={styles.profileImageSection}
          imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageIcon}>👤</Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Ubah Foto</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Form Data */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Siswa :</Text>
            <TextInput
              style={styles.input}
              value={profileData.nama}
              onChangeText={(text) => setProfileData({ ...profileData, nama: text })}
              placeholder="Masukkan nama lengkap"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NIM :</Text>
            <TextInput
              style={styles.input}
              value={profileData.nim}
              onChangeText={(text) => setProfileData({ ...profileData, nim: text })}
              placeholder="Masukkan NISN"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kelas :</Text>
            <TextInput
              style={styles.input}
              value={profileData.kelas}
              onChangeText={(text) => setProfileData({ ...profileData, kelas: text })}
              placeholder="Masukkan kelas"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Versi Aplikasi */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Versi Aplikasi 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
  },
  backButton: { padding: 8 },
  backIcon: { fontSize: 24, color: '#1E293B', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  placeholder: { width: 40 },

  content: { flex: 1, paddingBottom: 30 },

  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  profileImageContainer: { alignItems: 'center' },
  profileImage: {
    width: 120,
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 5,
  },
  profileImageIcon: { fontSize: 50, color: '#94A3B8' },
  changePhotoButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },

  formSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, color: '#374151', fontWeight: '500', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },

  logoutButton: {
    backgroundColor: '#DC2626',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  versionInfo: { alignItems: 'center', paddingVertical: 20 },
  versionText: { fontSize: 14, color: '#9CA3AF' },
});
