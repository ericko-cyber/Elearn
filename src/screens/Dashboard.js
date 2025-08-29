import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'

// Dashboard Component
export default function DashboardScreen() {
  const dashboardCards = [
    { title: 'Total Courses', value: '24', color: '#4F46E5', icon: '📚' },
    { title: 'Completed', value: '18', color: '#059669', icon: '✅' },
    { title: 'In Progress', value: '6', color: '#F59E0B', icon: '⏳' },
    { title: 'Certificates', value: '12', color: '#DC2626', icon: '🏆' },
  ];

  const recentCourses = [
    { title: 'React Native Fundamentals', progress: '85%', status: 'In Progress' },
    { title: 'JavaScript Advanced', progress: '100%', status: 'Completed' },
    { title: 'UI/UX Design Basics', progress: '45%', status: 'In Progress' },
    { title: 'Mobile App Development', progress: '20%', status: 'Just Started' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Custom Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <Text style={styles.navTitle}>E-Learning Dashboard</Text>
          <Text style={styles.navSubtitle}>Selamat datang kembali!</Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Ringkasan Pembelajaran</Text>
          <View style={styles.cardsRow}>
            {dashboardCards.map((card, index) => (
              <TouchableOpacity key={index} style={[styles.card, { borderLeftColor: card.color }]}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
                <Text style={styles.cardValue}>{card.value}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EEF2FF' }]}>
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionText}>Kursus Baru</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.actionIcon}>📖</Text>
              <Text style={styles.actionText}>Lanjutkan Belajar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFFBEB' }]}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Courses */}
        <View style={styles.coursesContainer}>
          <Text style={styles.sectionTitle}>Kursus Terbaru</Text>
          {recentCourses.map((course, index) => (
            <TouchableOpacity key={index} style={styles.courseCard}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseStatus}>{course.status}</Text>
              </View>
              <View style={styles.courseProgress}>
                <Text style={styles.progressText}>{course.progress}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: course.progress, backgroundColor: course.status === 'Completed' ? '#059669' : '#F59E0B' }
                    ]} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navLeft: {
    flex: 1,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  navSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 8,
    marginRight: 10,
  },
  profileIcon: {
    fontSize: 24,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 15,
    marginTop: 20,
  },
  statsContainer: {
    marginTop: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cardTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  coursesContainer: {
    marginTop: 10,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseInfo: {
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  courseStatus: {
    fontSize: 14,
    color: '#64748B',
  },
  courseProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
})