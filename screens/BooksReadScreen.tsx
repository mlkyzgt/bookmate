import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function BooksReadScreen() {
  const navigation = useNavigation();

  /*
    Normalde burada backend'den:
    - Kullanıcının okuduğu kitap listesi
    - Okuma ilerlemeleri
    - Kitap kapakları vb.
    alınacaktı.
  */
  const books = [
    {title: 'Atomic Habits', author: 'James Clear'},
    {title: 'Educated', author: 'Tara Westover'},
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Books Read</Text>

      {books.map(b => (
        <TouchableOpacity
          key={b.title}
          style={styles.bookCard}
          onPress={() =>
            navigation.navigate('BookDetail', {
<<<<<<< HEAD
              bookTitle: b.title,
=======
              bookTitle: b.title, 
>>>>>>> 11e811fdad3bd5c60d44caba06fae0ed13817591
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
