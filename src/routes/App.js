import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-reanimated';


// Import components & screens
import HomeScreen from '../components/HomeScreen';
import ProfileScreen from '../components/ProfileScreen';
import BottomNavigation from '../components/BottomNavigation';
import CameraScreen from '../components/CameraScreen';
import LoginScreen from '../components/Login';
import RegisterScreen from '../components/Register';
//import TrainingFace from '../components/TrainingFace';
import MateriEyeTrackingScreen from '../components/MateriEyeTracking'; 

const Stack = createNativeStackNavigator();

// Placeholder screens
const CoursesScreen = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.placeholderContent}>
      <Text style={styles.placeholderTitle}>My Courses</Text>
      <Text style={styles.placeholderText}>
        Halaman My Courses akan segera tersedia
      </Text>
    </View>
    <BottomNavigation />
  </View>
);

const NotificationsScreen = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.placeholderContent}>
      <Text style={styles.placeholderTitle}>Notifications</Text>
      <Text style={styles.placeholderText}>
        Halaman Notifications akan segera tersedia
      </Text>
    </View>
    <BottomNavigation />
  </View>
);

// Wrapper untuk menambahkan bottom navigation ke setiap screen
const HomeScreenWithNav = ({ navigation }) => {
  return (
    <View style={styles.screenContainer}>
      <HomeScreen navigation={navigation} />
      <BottomNavigation />
    </View>
  );
};

const ProfileScreenWithNav = ({ navigation }) => {
  return (
    <View style={styles.screenContainer}>
      <ProfileScreen navigation={navigation} />
      <BottomNavigation />
    </View>
  );
};

// Camera tanpa bottom nav
const CameraScreenNoNav = ({ navigation }) => {
  return <CameraScreen navigation={navigation} />;
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreenWithNav} />
        <Stack.Screen name="Training" component={HomeScreenWithNav} />
        {/* <Stack.Screen name="TrainingFace" component={TrainingFace} /> */}
        <Stack.Screen name="Profile" component={ProfileScreenWithNav} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Camera" component={CameraScreenNoNav} />
        <Stack.Screen name="MateriEyeTracking" component={MateriEyeTrackingScreen} /> 
        {/* ✅ sudah didaftarkan */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});