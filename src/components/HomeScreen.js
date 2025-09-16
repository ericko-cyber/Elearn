// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// // } from 'react-native';
// // import React from 'react';

// // const HomeScreen = ({ navigation }) => {
// //   const menuItems = [
// //     { title: 'Presensi', icon: '✅', color: '#3B82F6', route: 'Courses' },
// //     { title: 'Tugas', icon: '📝', color: '#10B981', route: 'Courses' },
// //     { title: 'Jadwal UTS', icon: '📅', color: '#F59E0B', route: 'Courses' },
// //     { title: 'Camera', icon: '📷', color: '#EF4444', route: 'Camera' }, // ✅ route ke Camera
// //   ];

// //   const assignments = [
// //     {
// //       title: 'Quiz Pilihan Ganda',
// //       subtitle: 'Komputer dan Jaringan Dasar',
// //       date: '21 Jul 2024',
// //       status: 'pending',
// //     },
// //     {
// //       title: 'Tugas Membuat Makalah',
// //       subtitle: 'Pembuatan Aplikasi dan Web Praktis',
// //       date: '22 Jul 2024',
// //       status: 'pending',
// //     },
// //   ];

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={styles.headerTop}>
// //           <View>
// //             <Text style={styles.greeting}>Halo, Selamat Datang</Text>
// //             <Text style={styles.subGreeting}>Rafi Ramdani Dinata</Text>
// //           </View>
// //           <TouchableOpacity style={styles.notificationButton}>
// //             <Text style={styles.notificationIcon}>🔔</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Menu Grid */}
// //         <View style={styles.menuGrid}>
// //           {menuItems.map((item, index) => (
// //             <TouchableOpacity
// //               key={index}
// //               style={styles.menuItem}
// //               onPress={() => navigation.navigate(item.route)} // ✅ langsung navigate
// //             >
// //               <View
// //                 style={[
// //                   styles.menuIconContainer,
// //                   { backgroundColor: item.color },
// //                 ]}
// //               >
// //                 <Text style={styles.menuIcon}>{item.icon}</Text>
// //               </View>
// //               <Text style={styles.menuText}>{item.title}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <ScrollView
// //         style={styles.content}
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={{ paddingBottom: 100 }}
// //       >
// //         {/* Presensi Hari Ini */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Presensi Hari Ini</Text>
// //           <TouchableOpacity style={styles.presenceCard}>
// //             <View style={styles.presenceLeft}>
// //               <View style={styles.presenceIcon}>
// //                 <Text style={styles.presenceIconText}>👤</Text>
// //               </View>
// //               <View style={styles.presenceContent}>
// //                 <Text style={styles.presenceTitle}>
// //                   Workshop Sistem Cerdas
// //                 </Text>
// //                 <Text style={styles.presenceSubtitle}>Kelas: 3.5</Text>

// //                 {/* Garis pemisah */}
// //                 <View style={styles.separator} />

// //                 {/* Tanggal dan Status dalam satu baris */}
// //                 <View style={styles.presenceDetails}>
// //                   <View style={styles.presenceDetailItem}>
// //                     <Text style={styles.presenceDetailIcon}>📅</Text>
// //                     <Text style={styles.presenceDetailText}>
// //                       Senin, 12-05-2024
// //                     </Text>
// //                   </View>
// //                   <View style={styles.presenceDetailItem}>
// //                     <Text style={styles.presenceDetailIcon}>🕐</Text>
// //                     <Text style={styles.presenceDetailText}>Hadir</Text>
// //                   </View>
// //                 </View>
// //               </View>
// //             </View>
// //             <Text style={styles.arrow}>›</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Daftar Tugas */}
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Daftar Tugas</Text>
// //             <TouchableOpacity>
// //               <Text style={styles.seeAll}>Lihat Semua</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {assignments.map((assignment, index) => (
// //             <TouchableOpacity key={index} style={styles.assignmentCard}>
// //               <View style={styles.assignmentLeft}>
// //                 <View style={styles.assignmentIcon}>
// //                   <Text style={styles.assignmentIconText}>📝</Text>
// //                 </View>
// //                 <View style={styles.assignmentInfo}>
// //                   <Text style={styles.assignmentTitle}>{assignment.title}</Text>
// //                   <Text style={styles.assignmentSubtitle}>
// //                     {assignment.subtitle}
// //                   </Text>
// //                 </View>
// //               </View>
// //               <View style={styles.assignmentRight}>
// //                 <Text style={styles.assignmentDate}>{assignment.date}</Text>
// //               </View>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // export default HomeScreen;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F8FAFC' },
// //   header: {
// //     backgroundColor: '#0083FD',
// //     paddingHorizontal: 20,
// //     paddingBottom: 25,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //   },
// //   headerTop: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingTop: 15,
// //     marginBottom: 25,
// //   },
// //   greeting: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
// //   subGreeting: { color: '#E0E7FF', fontSize: 14, marginTop: 2 },
// //   notificationButton: {
// //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //     padding: 10,
// //     borderRadius: 12,
// //   },
// //   notificationIcon: { fontSize: 20 },
// //   menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
// //   menuItem: { width: '30%', alignItems: 'center', marginBottom: 15 },
// //   menuIconContainer: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 15,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   menuIcon: { fontSize: 24 },
// //   menuText: {
// //     color: '#FFFFFF',
// //     fontSize: 12,
// //     textAlign: 'center',
// //     fontWeight: '500',
// //   },
// //   content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
// //   section: { marginBottom: 25 },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
// //   seeAll: { color: '#4F46E5', fontSize: 14, fontWeight: '500' },
// //   presenceCard: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 15,
// //     padding: 16,
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     justifyContent: 'space-between',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   presenceLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
// //   presenceIcon: {
// //     backgroundColor: '#EEF2FF',
// //     width: 45,
// //     height: 45,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   presenceIconText: { fontSize: 20 },
// //   presenceContent: { flex: 1 },
// //   presenceTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#1E293B',
// //     marginBottom: 2,
// //   },
// //   presenceSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 12 },
// //   separator: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 12 },
// //   presenceDetails: { flexDirection: 'row', justifyContent: 'space-between' },
// //   presenceDetailItem: { flexDirection: 'row', alignItems: 'center' },
// //   presenceDetailIcon: { fontSize: 14, marginRight: 6 },
// //   presenceDetailText: { fontSize: 13, color: '#1E293B', fontWeight: '500' },
// //   arrow: { fontSize: 20, color: '#CBD5E1', marginTop: 10 },
// //   assignmentCard: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 15,
// //     padding: 16,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   assignmentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
// //   assignmentIcon: {
// //     backgroundColor: '#FEF3C7',
// //     width: 45,
// //     height: 45,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   assignmentIconText: { fontSize: 20 },
// //   assignmentInfo: { flex: 1 },
// //   assignmentTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#1E293B',
// //     marginBottom: 2,
// //   },
// //   assignmentSubtitle: { fontSize: 13, color: '#64748B' },
// //   assignmentRight: { alignItems: 'flex-end' },
// //   assignmentDate: { fontSize: 12, color: '#64748B', fontWeight: '500' },
// // });

// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import React from 'react';

// const HomeScreen = ({navigation}) => {
//   const menuItems = [
//     {title: 'Presensi', icon: '✅', color: '#3B82F6', route: 'Courses'},
//     {title: 'Tugas', icon: '📝', color: '#10B981', route: 'Courses'},
//     {title: 'Jadwal UTS', icon: '📅', color: '#F59E0B', route: 'Courses'},
//     {title: 'Camera', icon: '📷', color: '#EF4444', route: 'Camera'}, // ✅ route ke Camera
//   ];

//   const assignments = [
//     {
//       title: 'Quiz Pilihan Ganda',
//       subtitle: 'Komputer dan Jaringan Dasar',
//       date: '21 Jul 2024',
//       status: 'pending',
//     },
//     {
//       title: 'Tugas Membuat Makalah',
//       subtitle: 'Pembuatan Aplikasi dan Web Praktis',
//       date: '22 Jul 2024',
//       status: 'pending',
//     },
//   ];

//   const materiList = [
//     {
//       id: 1,
//       title: 'Materi Game Design',
//       subtitle: 'Pengembangan Permainan',
//       date: '21 Jul 2024',
//       icon: '🎮',
//       description:
//         'Pelajari dasar-dasar perancangan game dan prinsip-prinsip game design',
//       duration: '45 menit',
//       difficulty: 'Beginner',
//     },
//     {
//       id: 2,
//       title: 'Materi Installasi Project',
//       subtitle: 'Workshop Mobile Application Advance',
//       date: '22 Jul 2024',
//       icon: '📱',
//       description:
//         'Setup dan instalasi project React Native untuk pengembangan aplikasi mobile',
//       duration: '60 menit',
//       difficulty: 'Intermediate',
//     },
//   ];

//   const getDifficultyColor = difficulty => {
//     switch (difficulty) {
//       case 'Beginner':
//         return '#10B981';
//       case 'Intermediate':
//         return '#F59E0B';
//       case 'Advanced':
//         return '#EF4444';
//       default:
//         return '#64748B';
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View>
//             <Text style={styles.greeting}>Halo, Selamat Datang</Text>
//             <Text style={styles.subGreeting}>Rafi Ramdani Dinata</Text>
//           </View>
//           <TouchableOpacity style={styles.notificationButton}>
//             <Text style={styles.notificationIcon}>🔔</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Menu Grid */}
//         <View style={styles.menuGrid}>
//           {menuItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.menuItem}
//               onPress={() => navigation.navigate(item.route)}>
//               <View
//                 style={[
//                   styles.menuIconContainer,
//                   {backgroundColor: item.color},
//                 ]}>
//                 <Text style={styles.menuIcon}>{item.icon}</Text>
//               </View>
//               <Text style={styles.menuText}>{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{paddingBottom: 100}}>
//         {/* Presensi Hari Ini */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Presensi Hari Ini</Text>
//           <TouchableOpacity style={styles.presenceCard}>
//             <View style={styles.presenceLeft}>
//               <View style={styles.presenceIcon}>
//                 <Text style={styles.presenceIconText}>👤</Text>
//               </View>
//               <View style={styles.presenceContent}>
//                 <Text style={styles.presenceTitle}>
//                   Workshop Sistem Cerdas
//                 </Text>
//                 <Text style={styles.presenceSubtitle}>Kelas: 3.5</Text>
//                 <View style={styles.separator} />
//                 <View style={styles.presenceDetails}>
//                   <View style={styles.presenceDetailItem}>
//                     <Text style={styles.presenceDetailIcon}>📅</Text>
//                     <Text style={styles.presenceDetailText}>
//                       Senin, 12-05-2024
//                     </Text>
//                   </View>
//                   <View style={styles.presenceDetailItem}>
//                     <Text style={styles.presenceDetailIcon}>🕐</Text>
//                     <Text style={styles.presenceDetailText}>Hadir</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//             <Text style={styles.arrow}>›</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Daftar Tugas */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Daftar Tugas</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAll}>Lihat Semua</Text>
//             </TouchableOpacity>
//           </View>
//           {assignments.map((assignment, index) => (
//             <TouchableOpacity key={index} style={styles.assignmentCard}>
//               <View style={styles.assignmentLeft}>
//                 <View style={styles.assignmentIcon}>
//                   <Text style={styles.assignmentIconText}>📝</Text>
//                 </View>
//                 <View style={styles.assignmentInfo}>
//                   <Text style={styles.assignmentTitle}>{assignment.title}</Text>
//                   <Text style={styles.assignmentSubtitle}>
//                     {assignment.subtitle}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.assignmentRight}>
//                 <Text style={styles.assignmentDate}>{assignment.date}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Daftar Materi */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Daftar Materi</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAll}>Lihat Semua</Text>
//             </TouchableOpacity>
//           </View>

//           {materiList.map((materi, index) => (
//             <TouchableOpacity key={index} style={styles.materiCard}>
//               <View style={styles.materiHeader}>
//                 <View style={styles.materiLeft}>
//                   <View style={styles.materiIcon}>
//                     <Text style={styles.materiIconText}>{materi.icon}</Text>
//                   </View>
//                   <View style={styles.materiInfo}>
//                     <Text style={styles.materiTitle}>{materi.title}</Text>
//                     <Text style={styles.materiSubtitle}>{materi.subtitle}</Text>
//                     <Text style={styles.materiDescription}>
//                       {materi.description}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.materiRight}>
//                   <Text style={styles.materiDate}>{materi.date}</Text>
//                 </View>
//               </View>

//               <View style={styles.materiFooter}>
//                 <View style={styles.materiTags}>
//                   <View style={styles.durationTag}>
//                     <Text style={styles.tagText}>⏱ {materi.duration}</Text>
//                   </View>
//                   <View
//                     style={[
//                       styles.difficultyTag,
//                       {
//                         backgroundColor:
//                           getDifficultyColor(materi.difficulty) + '20',
//                       },
//                     ]}>
//                     <Text
//                       style={[
//                         styles.tagText,
//                         {color: getDifficultyColor(materi.difficulty)},
//                       ]}>
//                       {materi.difficulty}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.eyeTrackingBadge}>
//                   <Text style={styles.eyeTrackingText}>👁 Eye Tracking</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

        

//         {/* Info Eye Tracking */}
//         <View style={styles.infoSection}>
//           <View style={styles.infoCard}>
//             <Text style={styles.infoIcon}>🔍</Text>
//             <View style={styles.infoContent}>
//               <Text style={styles.infoTitle}>Eye Tracking Technology</Text>
//               <Text style={styles.infoText}>
//                 Sistem akan memantau fokus mata Anda selama pembelajaran untuk
//                 menganalisis tingkat perhatian dan memberikan feedback belajar
//                 yang lebih baik.
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// export default HomeScreen;

// // Styles
// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#F8FAFC'},
//   header: {
//     backgroundColor: '#0083FD',
//     paddingHorizontal: 20,
//     paddingBottom: 25,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 15,
//     marginBottom: 25,
//   },
//   greeting: {color: '#FFFFFF', fontSize: 18, fontWeight: '600'},
//   subGreeting: {color: '#E0E7FF', fontSize: 14, marginTop: 2},
//   notificationButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     padding: 10,
//     borderRadius: 12,
//   },
//   notificationIcon: {fontSize: 20},
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   menuItem: {width: '30%', alignItems: 'center', marginBottom: 15},
//   menuIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   menuIcon: {fontSize: 24},
//   menuText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   content: {flex: 1, paddingHorizontal: 20, paddingTop: 20},
//   section: {marginBottom: 25},
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   sectionTitle: {fontSize: 18, fontWeight: '600', color: '#1E293B'},
//   seeAll: {color: '#4F46E5', fontSize: 14, fontWeight: '500'},

//   // Presensi
//   presenceCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   presenceLeft: {flexDirection: 'row', alignItems: 'flex-start', flex: 1},
//   presenceIcon: {
//     backgroundColor: '#EEF2FF',
//     width: 45,
//     height: 45,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   presenceIconText: {fontSize: 20},
//   presenceContent: {flex: 1},
//   presenceTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginBottom: 2,
//   },
//   presenceSubtitle: {fontSize: 14, color: '#64748B', marginBottom: 12},
//   separator: {height: 1, backgroundColor: '#E2E8F0', marginBottom: 12},
//   presenceDetails: {flexDirection: 'row', justifyContent: 'space-between'},
//   presenceDetailItem: {flexDirection: 'row', alignItems: 'center'},
//   presenceDetailIcon: {fontSize: 14, marginRight: 6},
//   presenceDetailText: {fontSize: 13, color: '#1E293B', fontWeight: '500'},
//   arrow: {fontSize: 20, color: '#CBD5E1', marginTop: 10},

//   // Tugas
//   assignmentCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   assignmentLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
//   assignmentIcon: {
//     backgroundColor: '#FEF3C7',
//     width: 45,
//     height: 45,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   assignmentIconText: {fontSize: 20},
//   assignmentInfo: {flex: 1},
//   assignmentTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginBottom: 2,
//   },
//   assignmentSubtitle: {fontSize: 13, color: '#64748B'},
//   assignmentRight: {alignItems: 'flex-end'},
//   assignmentDate: {fontSize: 12, color: '#64748B', fontWeight: '500'},

//   // Materi
//   materiCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 16,
//     elevation: 3,
//     borderLeftWidth: 4,
//     borderLeftColor: '#4F46E5',
//   },
//   materiHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   materiLeft: {flexDirection: 'row', flex: 1},
//   materiIcon: {
//     backgroundColor: '#F0F9FF',
//     width: 50,
//     height: 50,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   materiIconText: {fontSize: 24},
//   materiInfo: {flex: 1},
//   materiTitle: {fontSize: 17, fontWeight: '700', color: '#1E293B'},
//   materiSubtitle: {fontSize: 14, color: '#64748B', marginBottom: 6},
//   materiDescription: {fontSize: 13, color: '#64748B'},
//   materiRight: {alignItems: 'flex-end'},
//   materiDate: {fontSize: 12, color: '#94A3B8', fontWeight: '500'},
//   materiFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderTopWidth: 1,
//     borderTopColor: '#F1F5F9',
//     paddingTop: 12,
//   },
//   materiTags: {flexDirection: 'row', gap: 8},
//   durationTag: {
//     backgroundColor: '#F1F5F9',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   difficultyTag: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
//   tagText: {fontSize: 11, fontWeight: '600'},
//   eyeTrackingBadge: {
//     backgroundColor: '#EEF2FF',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   eyeTrackingText: {fontSize: 11, color: '#4F46E5', fontWeight: '600'},

//   // Info Eye Tracking
//   infoSection: {marginBottom: 30},
//   infoCard: {
//     backgroundColor: '#F0F9FF',
//     borderRadius: 16,
//     padding: 18,
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#BAE6FD',
//   },
//   infoIcon: {fontSize: 24, marginRight: 14},
//   infoContent: {flex: 1},
//   infoTitle: {fontSize: 16, fontWeight: '600', color: '#0C4A6E'},
//   infoText: {fontSize: 13, color: '#0C4A6E'},
// });
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React from 'react';

const HomeScreen = ({navigation}) => {
  const menuItems = [
    {title: 'Presensi', icon: '✅', color: '#3B82F6', route: 'Courses'},
    {title: 'Tugas', icon: '📝', color: '#10B981', route: 'Courses'},
    {title: 'Jadwal UTS', icon: '📅', color: '#F59E0B', route: 'Courses'},
    {title: 'Camera', icon: '📷', color: '#EF4444', route: 'Camera'},
  ];

  const assignments = [
    {
      title: 'Quiz Pilihan Ganda',
      subtitle: 'Komputer dan Jaringan Dasar',
      date: '21 Jul 2024',
      status: 'pending',
    },
    {
      title: 'Tugas Membuat Makalah',
      subtitle: 'Pembuatan Aplikasi dan Web Praktis',
      date: '22 Jul 2024',
      status: 'pending',
    },
  ];

  const materiList = [
    {
      id: 1,
      title: 'Materi Game Design',
      subtitle: 'Pengembangan Permainan',
      date: '21 Jul 2024',
      icon: '🎮',
      description:
        'Pelajari dasar-dasar perancangan game dan prinsip-prinsip game design',
      duration: '45 menit',
      difficulty: 'Beginner',
    },
    {
      id: 2,
      title: 'Materi Installasi Project',
      subtitle: 'Workshop Mobile Application Advance',
      date: '22 Jul 2024',
      icon: '📱',
      description:
        'Setup dan instalasi project React Native untuk pengembangan aplikasi mobile',
      duration: '60 menit',
      difficulty: 'Intermediate',
    },
  ];

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  // Handle ketika materi diklik - navigasi ke halaman materi dengan eye tracking
  const handleMateriPress = (materi) => {
    navigation.navigate('MateriEyeTracking', { materi: materi });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Halo, Selamat Datang</Text>
            <Text style={styles.subGreeting}>Rafi Ramdani Dinata</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}>
              <View
                style={[
                  styles.menuIconContainer,
                  {backgroundColor: item.color},
                ]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* Presensi Hari Ini */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presensi Hari Ini</Text>
          <TouchableOpacity style={styles.presenceCard}>
            <View style={styles.presenceLeft}>
              <View style={styles.presenceIcon}>
                <Text style={styles.presenceIconText}>👤</Text>
              </View>
              <View style={styles.presenceContent}>
                <Text style={styles.presenceTitle}>
                  Workshop Sistem Cerdas
                </Text>
                <Text style={styles.presenceSubtitle}>Kelas: 3.5</Text>
                <View style={styles.separator} />
                <View style={styles.presenceDetails}>
                  <View style={styles.presenceDetailItem}>
                    <Text style={styles.presenceDetailIcon}>📅</Text>
                    <Text style={styles.presenceDetailText}>
                      Senin, 12-05-2024
                    </Text>
                  </View>
                  <View style={styles.presenceDetailItem}>
                    <Text style={styles.presenceDetailIcon}>🕐</Text>
                    <Text style={styles.presenceDetailText}>Hadir</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

   
        {/* Daftar Materi */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Materi</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {materiList.map((materi, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.materiCard}
              onPress={() => handleMateriPress(materi)} // Ditambahkan onPress untuk navigasi
            >
              <View style={styles.materiHeader}>
                <View style={styles.materiLeft}>
                  <View style={styles.materiIcon}>
                    <Text style={styles.materiIconText}>{materi.icon}</Text>
                  </View>
                  <View style={styles.materiInfo}>
                    <Text style={styles.materiTitle}>{materi.title}</Text>
                    <Text style={styles.materiSubtitle}>{materi.subtitle}</Text>
                    <Text style={styles.materiDescription}>
                      {materi.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.materiRight}>
                  <Text style={styles.materiDate}>{materi.date}</Text>
                </View>
              </View>

              <View style={styles.materiFooter}>
                <View style={styles.materiTags}>
                  <View style={styles.durationTag}>
                    <Text style={styles.tagText}>⏱ {materi.duration}</Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyTag,
                      {
                        backgroundColor:
                          getDifficultyColor(materi.difficulty) + '20',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.tagText,
                        {color: getDifficultyColor(materi.difficulty)},
                      ]}>
                      {materi.difficulty}
                    </Text>
                  </View>
                </View>
                <View style={styles.eyeTrackingBadge}>
                  <Text style={styles.eyeTrackingText}>👁 Eye Tracking</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Eye Tracking */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Eye Tracking Technology</Text>
              <Text style={styles.infoText}>
                Sistem akan memantau fokus mata Anda selama pembelajaran untuk
                menganalisis tingkat perhatian dan memberikan feedback belajar
                yang lebih baik.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  header: {
    backgroundColor: '#0083FD',
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginBottom: 25,
  },
  greeting: {color: '#FFFFFF', fontSize: 18, fontWeight: '600'},
  subGreeting: {color: '#E0E7FF', fontSize: 14, marginTop: 2},
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
  },
  notificationIcon: {fontSize: 20},
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {width: '30%', alignItems: 'center', marginBottom: 15},
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIcon: {fontSize: 24},
  menuText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {flex: 1, paddingHorizontal: 20, paddingTop: 20},
  section: {marginBottom: 25},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {fontSize: 18, fontWeight: '600', color: '#1E293B'},
  seeAll: {color: '#4F46E5', fontSize: 14, fontWeight: '500'},

  // Presensi
  presenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  presenceLeft: {flexDirection: 'row', alignItems: 'flex-start', flex: 1},
  presenceIcon: {
    backgroundColor: '#EEF2FF',
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  presenceIconText: {fontSize: 20},
  presenceContent: {flex: 1},
  presenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  presenceSubtitle: {fontSize: 14, color: '#64748B', marginBottom: 12},
  separator: {height: 1, backgroundColor: '#E2E8F0', marginBottom: 12},
  presenceDetails: {flexDirection: 'row', justifyContent: 'space-between'},
  presenceDetailItem: {flexDirection: 'row', alignItems: 'center'},
  presenceDetailIcon: {fontSize: 14, marginRight: 6},
  presenceDetailText: {fontSize: 13, color: '#1E293B', fontWeight: '500'},
  arrow: {fontSize: 20, color: '#CBD5E1', marginTop: 10},

  // Tugas
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  assignmentLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  assignmentIcon: {
    backgroundColor: '#FEF3C7',
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assignmentIconText: {fontSize: 20},
  assignmentInfo: {flex: 1},
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  assignmentSubtitle: {fontSize: 13, color: '#64748B'},
  assignmentRight: {alignItems: 'flex-end'},
  assignmentDate: {fontSize: 12, color: '#64748B', fontWeight: '500'},

  // Materi
  materiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  materiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  materiLeft: {flexDirection: 'row', flex: 1},
  materiIcon: {
    backgroundColor: '#F0F9FF',
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  materiIconText: {fontSize: 24},
  materiInfo: {flex: 1},
  materiTitle: {fontSize: 17, fontWeight: '700', color: '#1E293B'},
  materiSubtitle: {fontSize: 14, color: '#64748B', marginBottom: 6},
  materiDescription: {fontSize: 13, color: '#64748B'},
  materiRight: {alignItems: 'flex-end'},
  materiDate: {fontSize: 12, color: '#94A3B8', fontWeight: '500'},
  materiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  materiTags: {flexDirection: 'row', gap: 8},
  durationTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyTag: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  tagText: {fontSize: 11, fontWeight: '600'},
  eyeTrackingBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  eyeTrackingText: {fontSize: 11, color: '#4F46E5', fontWeight: '600'},

  // Info Eye Tracking
  infoSection: {marginBottom: 30},
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoIcon: {fontSize: 24, marginRight: 14},
  infoContent: {flex: 1},
  infoTitle: {fontSize: 16, fontWeight: '600', color: '#0C4A6E'},
  infoText: {fontSize: 13, color: '#0C4A6E'},
});