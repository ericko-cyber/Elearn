// import React from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createStaticNavigation } from '@react-navigation/native';

// // Import components
// import HomeScreen from './components/HomeScreen';
// import ProfileScreen from './components/ProfileScreen';
// import BottomNavigation from './components/BottomNavigation';
// import CameraScreen from './components/CameraScreen';
// import LoginScreen from './components/Login'; // ✅ Tambahkan ini

// // Placeholder screens
// const CoursesScreen = () => (
//   <View style={styles.placeholderContainer}>
//     <View style={styles.placeholderContent}>
//       <Text style={styles.placeholderTitle}>My Courses</Text>
//       <Text style={styles.placeholderText}>Halaman My Courses akan segera tersedia</Text>
//     </View>
//     <BottomNavigation />
//   </View>
// );

// const NotificationsScreen = () => (
//   <View style={styles.placeholderContainer}>
//     <View style={styles.placeholderContent}>
//       <Text style={styles.placeholderTitle}>Notifications</Text>
//       <Text style={styles.placeholderText}>Halaman Notifications akan segera tersedia</Text>
//     </View>
//     <BottomNavigation />
//   </View>
// );

// // Wrapper untuk menambahkan bottom navigation ke setiap screen
// const HomeScreenWithNav = ({ navigation }) => {
//   return (
//     <View style={styles.screenContainer}>
//       <HomeScreen navigation={navigation} />
//       <BottomNavigation />
//     </View>
//   );
// };

// const ProfileScreenWithNav = ({ navigation }) => {
//   return (
//     <View style={styles.screenContainer}>
//       <ProfileScreen navigation={navigation} />
//       <BottomNavigation />
//     </View>
//   );
// };

// // Camera tanpa bottom nav
// const CameraScreenNoNav = ({ navigation }) => {
//   return <CameraScreen navigation={navigation} />;
// };

// // ✅ Stack navigator dengan Login sebagai awal
// const RootStack = createNativeStackNavigator({
//   screens: {
//     Login: {
//       screen: LoginScreen,
//       options: { headerShown: false },
//     },
//     Home: {
//       screen: HomeScreenWithNav,
//       options: { headerShown: false },
//     },
//     Profile: {
//       screen: ProfileScreenWithNav,
//       options: { headerShown: false },
//     },
//     Courses: {
//       screen: CoursesScreen,
//       options: { headerShown: false },
//     },
//     Notifications: {
//       screen: NotificationsScreen,
//       options: { headerShown: false },
//     },
//     Camera: {
//       screen: CameraScreenNoNav,
//       options: { headerShown: false },
//     },
//   },
// });

// const Navigation = createStaticNavigation(RootStack);

// const App = () => {
//   return <Navigation />;
// };

// export default App;

// const styles = StyleSheet.create({
//   screenContainer: {
//     flex: 1,
//   },
//   placeholderContainer: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   placeholderContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   placeholderTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginBottom: 10,
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#64748B',
//     textAlign: 'center',
//   },
// });

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import components
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';
import CameraScreen from './components/CameraScreen';
import LoginScreen from './components/Login';
import RegisterScreen from './components/Register';

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
        <Stack.Screen name="Profile" component={ProfileScreenWithNav} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Camera" component={CameraScreenNoNav} />
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
