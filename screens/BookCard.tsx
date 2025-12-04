import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Book} from './types';
import ProgressBar from './ProgressBar';

interface Props {
  book: Book;
  onPress: () => void;
}

export default function BookCard({book, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* BOOK COVER */}
      <Image source={{uri: book.thumbnail}} style={styles.image} />

      <View style={styles.info}>
        {/* TITLE */}
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>

        {/* AUTHOR */}
        <Text style={styles.author} numberOfLines={1}>
          {book.authors?.[0] ?? 'Unknown Author'}
        </Text>

        {/* READING PROGRESS BAR */}
        <ProgressBar progress={book.progress ?? 0} />

        <Text style={styles.percent}>
          {Math.round((book.progress ?? 0) * 100)}%
        </Text>

        {/*
          Eğer API’den ekstra bilgi alınacaksa veya
          bu kitap kartına tıklanınca veritabanı ile
          etkileşim gerekirse burada yapılacak.
        */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#eef6ff',
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  title: {fontSize: 18, fontWeight: '600', color: '#1A3D7C'},
  author: {color: '#456', marginBottom: 6, fontSize: 14},
  percent: {
    marginTop: 4,
    fontWeight: '600',
    color: '#1A3D7C',
  },
});
