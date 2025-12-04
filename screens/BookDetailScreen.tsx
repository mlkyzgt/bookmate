import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

export default function BookDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const {bookTitle, thumbnail} = route.params ?? {};

  /*
    Normalde burada:
    - Kitabın ayrıntılarının API'den alınması (author, description, categories vb.)
    - Kullanıcının kitapla ilgili ilerleme bilgilerinin DB'den çekilmesi
    yapılacaktı.
  */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Book Details</Text>

      {/* BOOK COVER */}
      {thumbnail ? (
        <Image source={{uri: thumbnail}} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.placeholderText}>No Cover</Text>
        </View>
      )}

      {/* BOOK NAME */}
      <Text style={styles.bookTitle}>{bookTitle}</Text>

      {/* STATIC DEMO INFO */}
      <Text style={styles.label}>Author: James Clear</Text>
      <Text style={styles.label}>Published Year: 2018</Text>
      <Text style={styles.label}>Publisher: Random House</Text>
      <Text style={styles.label}>ISBN: 9780735211292</Text>
      <Text style={styles.label}>Pages Read: 120 / 280</Text>
      <Text style={styles.label}>Started Reading: 04/12/2025</Text>

      {/* ADD QUOTE BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('AddQuote', {
            bookTitle,
            thumbnail,
          })
        }>
        <Text style={styles.buttonText}>Add Quote</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F8FAFF'},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },

  cover: {
    width: 160,
    height: 240,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 20,
  },

  coverPlaceholder: {
    width: 160,
    height: 240,
    backgroundColor: '#E0E6F0',
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {color: '#777'},

  bookTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },

  label: {fontSize: 16, marginBottom: 8, textAlign: 'center'},

  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});
