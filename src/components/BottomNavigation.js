
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const navItems = [
    { name: 'Home', icon: '🏠', route: 'Home' },
    { name: 'My Courses', icon: '📚', route: 'Courses' },
    { name: 'Notifications', icon: '🔔', route: 'Notifications' },
    { name: 'Profile', icon: '👤', route: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.navItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[
            styles.navText, 
            route.name === item.route && styles.navTextActive
          ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});