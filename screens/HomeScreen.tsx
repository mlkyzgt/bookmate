import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message'; // Flash Message eklendi
import {
  searchBooks,
  getUserBooks,
  getUserProfile,
} from '../services/bookServices';
import BookCard from './components/BookCard';
import BookRecommender from './components/BookRecommender';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readingBooks, setReadingBooks] = useState([]);
  const [toReadBooks, setToReadBooks] = useState([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reading, toRead, userProfile] = await Promise.all([
        getUserBooks('reading'),
        getUserBooks('toread'),
        getUserProfile(),
      ]);
      setReadingBooks(reading || []);
      setToReadBooks(toRead || []);
      setProfile(userProfile);
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Veri Yükleme Hatası',
        description: 'Kütüphane bilgileri çekilemedi.',
        type: 'danger',
        backgroundColor: '#7D677D', // Plum Haze
      });
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    Keyboard.dismiss();
    try {
      const results = await searchBooks(query);
      if (results.length === 0) {
        showMessage({
          message: 'Sonuç Bulunamadı',
          description: 'Aradığınız kriterlere uygun kitap bulunamadı.',
          type: 'info',
          backgroundColor: '#7D677D', // Plum Haze
        });
      }
      setSearchResults(results);
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Arama Hatası',
        description: 'Servis bağlantısı kurulamadı.',
        type: 'danger',
        backgroundColor: '#7D677D', // Plum Haze
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeLabel}>Merhaba,</Text>
            <Text style={styles.userName}>{profile?.username || 'Okur'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: profile?.avatarUrl || 'https://via.placeholder.com/150',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Kitap ara..."
          placeholderTextColor="#ACB9A8"
          value={query}
          onChangeText={t => {
            setQuery(t);
            if (t === '') setSearchResults([]);
          }}
          onSubmitEditing={handleSearch}
        />

        {loading ? (
          <ActivityIndicator
            color="#4B5D4E"
            size="large"
            style={{ marginTop: 20 }}
          />
        ) : query.length > 0 && searchResults.length > 0 ? (
          /* ARAMA MODU: DİKEY LİSTE */
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Arama Sonuçları</Text>
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearText}>Temizle</Text>
              </TouchableOpacity>
            </View>
            {searchResults.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  navigation.navigate('BookDetail', { id: item.id })
                }
              >
                <BookCard book={item} isLibrary={false} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          /* ANA AKIŞ: YATAY LİSTELER */
          <>
            <BookRecommender
              onSelectBook={b => {
                setQuery(b);
                handleSearch();
              }}
            />

            <Text style={styles.sectionTitle}>Şu An Okudukların</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {readingBooks.length > 0 ? (
                readingBooks.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate('BookDetail', { id: item.id })
                    }
                  >
                    <BookCard book={item} isLibrary={true} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyInfo}>Henüz kitap eklemedin.</Text>
              )}
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
              Okuma Listesi
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {toReadBooks.length > 0 ? (
                toReadBooks.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate('BookDetail', { id: item.id })
                    }
                  >
                    <BookCard book={item} isLibrary={true} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyInfo}>Okuma listen boş.</Text>
              )}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#EAE4D9' }, // Chiffon
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  welcomeLabel: { fontSize: 16, color: '#7D677D' }, // Plum Haze
  userName: { fontSize: 32, fontWeight: 'bold', color: '#4B5D4E' }, // Evergreen
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4B5D4E',
  },
  searchBar: {
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D9BBA9', // Apricot
    color: '#4B5D4E',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B5D4E',
  },
  clearText: {
    color: '#7D677D',
    fontWeight: '600',
  },
  emptyInfo: {
    color: '#ACB9A8', // Sage Green
    fontStyle: 'italic',
    paddingVertical: 10,
  },
});
