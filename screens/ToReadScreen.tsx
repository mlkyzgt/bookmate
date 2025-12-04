import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function ToReadScreen() {
  const navigation = useNavigation();

  // ------------------------------------------------------------
  // Kullanıcının "To Be Read" listesini API'den çekecek.
  // Şu anlık mock data kullanılıyor.
  // ------------------------------------------------------------
  const books = [
    {
      id: '4',
      title: 'The Invisible Life of Addie LaRue',
      author: 'V.E. Schwab',

      // ------------------------------------------------------------
      // Bu kitap kullanıcının TBR tablosunda bulunacak.
      // BookDetail ekranında ek bilgiler DB'den alınacak.
      // ------------------------------------------------------------
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>To Be Read</Text>

      {books.map(b => (
        <TouchableOpacity
          key={b.id}
          style={styles.bookCard}
          onPress={() =>
            navigation.navigate('BookDetail', {
              // ------------------------------------------------------------
              // Burada sadece id gidiyor.
              // Gerçekte tüm kitap detayları DB'den alınacak.
              // ------------------------------------------------------------
              id: b.id,
            })
          }>
          <Text style={styles.title}>{b.title}</Text>
          <Text style={styles.author}>{b.author}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F8FAFF'},
  header: {fontSize: 22, fontWeight: 'bold', marginBottom: 15},
  bookCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {fontSize: 16, fontWeight: 'bold'},
  author: {color: '#666'},
});
