import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal, // Custom Alert için eklendi
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getUserProfile, getSavedQuotes } from '../services/bookServices';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [profile, setProfile] = useState<any>(null);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [counts, setCounts] = useState({ read: 0, reading: 0, toread: 0 });
  const [totalPagesRead, setTotalPagesRead] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- CUSTOM ALERT STATE ---
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) return;

      const [profileData, quotesData] = await Promise.all([
        getUserProfile(),
        getSavedQuotes(),
      ]);
      setProfile(profileData);
      setRecentQuotes(quotesData.slice(0, 3));

      const booksSnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('myBooks')
        .get();

      let read = 0,
        reading = 0,
        toread = 0,
        totalPages = 0;

      booksSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'read') read++;
        else if (data.status === 'reading') reading++;
        else if (data.status === 'toread') toread++;

        if (data.status === 'read') {
          totalPages += data.totalPage || 0;
        } else {
          totalPages += data.pagesRead || 0;
        }
      });

      setCounts({ read, reading, toread });
      setTotalPagesRead(totalPages);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Çıkış Onay Penceresini Açan Fonksiyon
  const handleLogoutPress = () => {
    setIsLogoutModalVisible(true);
  };

  // Çıkış İşlemini Gerçekleştiren Fonksiyon
  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    auth().signOut();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4B5D4E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navLink}>← Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navLink}>⚙️ Ayarlar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: profile?.avatarUrl || 'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>{profile?.username || 'Okur'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      <View style={styles.trackerCard}>
        <Text style={styles.trackerTitle}>Toplam Okunan Sayfa</Text>
        <Text style={styles.trackerValue}>{totalPagesRead}</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.badgeText}>Okumaya devam et!</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() =>
            navigation.navigate('BookList', {
              type: 'read',
              title: 'Okunanlar',
            })
          }
        >
          <Text style={styles.statNum}>{counts.read}</Text>
          <Text style={styles.statLabel}>Okundu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statBox}
          onPress={() =>
            navigation.navigate('BookList', {
              type: 'reading',
              title: 'Okunuyor',
            })
          }
        >
          <Text style={styles.statNum}>{counts.reading}</Text>
          <Text style={styles.statLabel}>Okunuyor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statBox}
          onPress={() =>
            navigation.navigate('BookList', {
              type: 'toread',
              title: 'Okunacak',
            })
          }
        >
          <Text style={styles.statNum}>{counts.toread}</Text>
          <Text style={styles.statLabel}>Okunacak</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son Alıntılar</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Quotes')}>
          <Text style={styles.seeMore}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>

      {recentQuotes.length > 0 ? (
        recentQuotes.map((q, i) => (
          <View key={i} style={styles.quoteItem}>
            <Text style={styles.quoteText}>"{q.quote_text}"</Text>
            <Text style={styles.quoteAuthor}>— {q.book_title}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyQuote}>Henüz bir alıntı kaydetmedin.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Text style={styles.logoutButtonText}>Oturumu Kapat</Text>
      </TouchableOpacity>
      <View style={{ height: 50 }} />

      {/* --- TEMAYA UYGUN ÇIKIŞ ALERT (MODAL) --- */}
      <Modal visible={isLogoutModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Oturumu Kapat</Text>
            <Text style={styles.modalMessage}>
              Uygulamadan çıkış yapmak istediğinize emin misiniz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>VAZGEÇ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmBtnText}>ÇIKIŞ YAP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAE4D9', paddingHorizontal: 20 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAE4D9',
  },
  topNav: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navLink: { color: '#4B5D4E', fontWeight: 'bold', fontSize: 16 },
  profileHeader: { alignItems: 'center', marginTop: 25 },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4B5D4E',
    padding: 3,
    marginBottom: 10,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 50 },
  username: { fontSize: 24, fontWeight: 'bold', color: '#4B5D4E' },
  email: { fontSize: 14, color: '#7D677D', marginBottom: 20 },
  trackerCard: {
    backgroundColor: '#4B5D4E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  trackerTitle: { color: '#EAE4D9', fontSize: 14, opacity: 0.9 },
  trackerValue: {
    color: '#EAE4D9',
    fontSize: 38,
    fontWeight: '800',
    marginVertical: 4,
  },
  progressBadge: {
    backgroundColor: '#ACB9A8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: '#4B5D4E', fontSize: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: {
    width: '31%',
    backgroundColor: '#ACB9A8',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#4B5D4E' },
  statLabel: { fontSize: 12, color: '#4B5D4E', fontWeight: '600' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4B5D4E' },
  seeMore: { color: '#7D677D', fontWeight: 'bold' },
  quoteItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#D9BBA9',
  },
  quoteText: { fontStyle: 'italic', color: '#4B5D4E', lineHeight: 20 },
  quoteAuthor: {
    textAlign: 'right',
    marginTop: 8,
    fontSize: 12,
    color: '#7D677D',
    fontWeight: 'bold',
  },
  emptyQuote: { textAlign: 'center', color: '#7D677D', fontStyle: 'italic' },
  logoutButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D677D',
    alignItems: 'center',
  },
  logoutButtonText: { color: '#7D677D', fontWeight: 'bold' },

  /* --- MODAL STILLERI (BORDO TONLARI) --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#EAE4D9',
    borderRadius: 25,
    padding: 25,
    borderWidth: 2,
    borderColor: '#D9BBA9',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#550000',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#7D677D',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { color: '#000000', fontWeight: 'bold' },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#550000',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold' },
});
