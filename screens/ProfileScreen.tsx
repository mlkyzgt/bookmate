import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  /*
    ---------------------------------------------------------
    KULLANICI VERİLERİ BACKEND'DEN GELECEK
    ---------------------------------------------------------
    Örn:
    - Profil resmi
    - Kullanıcı adı
    - Okunan kitap sayısı
    - Devam edilen kitap sayısı
    - To Read sayısı
    - Son 3 alıntı
    Bu veriler API'den çekilecek.
  */

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backText}>Ana Sayfa</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE AREA */}
      <View style={styles.profileArea}>
        {/* Profil fotoğrafı backend'den gelecek */}
        <Image
          source={{uri: 'https://via.placeholder.com/100'}}
          style={styles.avatar}
        />

        {/* Kullanıcı adı backend'den gelecek */}
        <Text style={styles.username}>Sarah Johnson</Text>

        {/* Kullanıcı açıklaması backend'den gelecek */}
        <Text style={styles.subtitle}>Book Enthusiast</Text>
      </View>

      {/* STAT SECTION */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('BooksRead')}>
          {/* Okunan kitap sayısı backend'den gelecek */}
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Books Read</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('InProgress')}>
          {/* Devam edilen kitap sayısı backend'den gelecek */}
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Reading</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('ToRead')}>
          {/* To Read sayısı backend'den gelecek */}
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>To Read</Text>
        </TouchableOpacity>
      </View>

      {/* READING TRACKER */}
      <Text style={styles.sectionTitle}>Reading Tracker 2025</Text>
      <View style={styles.trackerBox}>
        {/* Okuma istatistik grafiği backend'den gelecek */}
        <Text style={{color: '#666'}}></Text>
        <Text style={{fontSize: 12, color: '#888', marginTop: 5}}>
          (Veritabanı tamamlanınca bitecek)
        </Text>
      </View>

      {/* FAVORITE QUOTES */}
      <View style={styles.quotesHeader}>
        <Text style={styles.sectionTitle}>Favorite Quotes</Text>

        {/* SEE MORE BUTTON */}
        <TouchableOpacity
          onPress={
            () => navigation.navigate('Quotes')
          }
          style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>

      {/* Last 3 quotes */}
      {/* Bu son 3 alıntı backend'den gelecek */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>Quote 1</Text>
      </View>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>Quote 2</Text>
      </View>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>Quote 3</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F8FAFF'},

  header: {
    marginTop: 10,
  },
  backText: {
    color: '#1A3D7C',
    fontSize: 18,
    fontWeight: '500',
  },

  profileArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 10},
  username: {fontSize: 22, fontWeight: 'bold', color: '#1A1A1A'},
  subtitle: {fontSize: 14, color: '#666'},

  statsRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '30%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {fontSize: 22, fontWeight: 'bold', color: '#1A3D7C'},
  statLabel: {fontSize: 14, color: '#555'},

  sectionTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A3D7C',
  },

  trackerBox: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },

  quotesHeader: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeMoreButton: {
    padding: 5,
  },
  seeMoreText: {
    color: '#4A90E2',
    fontSize: 14,
  },

  quoteBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  quoteText: {
    fontSize: 15,
    color: '#333',
    fontStyle: 'italic',
  },
});
