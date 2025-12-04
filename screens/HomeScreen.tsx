import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation();

  // ------------------------------------------------------------
  // Google Books API'den kitap verileri çekilecek
  // Şu anda mock data kullanılıyor
  // ------------------------------------------------------------
  const currentlyReading = [
    {
      id: '1',
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',

      // progress veritabanından gelecektir
      progress: null,
    },
  ];

  const toBeRead = [
    {
      id: '3',
      title: 'The Invisible Life of Addie LaRue',
      author: 'V.E. Schwab',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71g2ednj0JL.jpg',

      // Bu kitap TBR listesinde yer alacak
    },
  ];
  // ------------------------------------------------------------

  const renderBookCard = book => (
    <TouchableOpacity
      key={book.id}
      style={styles.bookCard}
      onPress={() =>
        navigation.navigate('BookDetail', {
          // ------------------------------------------------------------
          // BookDetail ekranında veriler DB'den alınacak
          // Şimdilik sadece id gönderiliyor
          // ------------------------------------------------------------
          id: book.id,
        })
      }>
      <Image source={{uri: book.cover}} style={styles.bookCover} />

      <Text style={styles.bookTitle} numberOfLines={1}>
        {book.title}
      </Text>

      <Text style={styles.bookAuthor} numberOfLines={1}>
        {book.author}
      </Text>

      {/* ------------------------------------------------------------
          progress kullanıcıya özel olacak, burada örnek gizlendi
         ------------------------------------------------------------ */}
      {book.progress && (
        <View style={{marginTop: 6}}>
          <Text style={styles.progressText}>
            {(book.progress * 100).toFixed(0)}% completed
          </Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {width: `${book.progress * 100}%`},
              ]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Bookmate</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search books..."
        placeholderTextColor="#999"
      />

      {/* CURRENTLY READING */}
      <Text style={styles.sectionTitle}>Currently Reading</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {currentlyReading.map(renderBookCard)}
      </ScrollView>

      {/* TO BE READ */}
      <Text style={styles.sectionTitle}>To Be Read</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {toBeRead.map(renderBookCard)}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },

  /* HEADER */
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A3D7C',
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDEAFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },

  /* SEARCH BAR */
  searchBar: {
    width: screenWidth - 40,
    height: 45,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E6F0',
  },

  /* SECTION TITLES */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
    color: '#1A3D7C',
  },

  /* BOOK CARD */
  bookCard: {
    width: 130,
    marginLeft: 20,
    marginBottom: 20,
  },

  bookCover: {
    width: 130,
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  bookAuthor: {
    fontSize: 12,
    color: '#666',
  },

  /* PROGRESS */
  progressText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },

  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5EAF0',
    borderRadius: 5,
  },

  progressBarFill: {
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
});
