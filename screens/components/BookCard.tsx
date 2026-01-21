import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface BookCardProps {
  book: any;
  isLibrary?: boolean;
}

export default function BookCard({ book, isLibrary = false }: BookCardProps) {
  // Google API vs Firestore veri eşleşmesi
  const title = isLibrary ? book.title : book.volumeInfo?.title;
  const authors = isLibrary ? book.authors : book.volumeInfo?.authors;
  const thumbnail = isLibrary ? book.thumbnail : book.volumeInfo?.imageLinks?.thumbnail;
  const totalPage = isLibrary ? book.totalPage : (book.volumeInfo?.pageCount || 0);
  const pagesRead = isLibrary ? (book.pagesRead || 0) : 0;

  // İlerleme yüzdesi hesabı
  const progress = totalPage > 0 ? Math.round((pagesRead / totalPage) * 100) : 0;

  return (
    <View style={[styles.card, isLibrary ? styles.libraryCard : styles.searchCard]}>
      <Image
        source={{ uri: thumbnail?.replace('http://', 'https://') || 'https://via.placeholder.com/150' }}
        style={styles.cover}
      />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.author}>
          {authors ? authors.join(', ') : 'Bilinmeyen Yazar'}
        </Text>

        {isLibrary ? (
          /* KÜTÜPHANE GÖRÜNÜMÜ: Progress Bar */
          <View style={styles.progressSection}>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>%{progress} tamamlandı</Text>
          </View>
        ) : (
          /* ARAMA GÖRÜNÜMÜ: Sayfa Bilgisi */
          <View style={styles.searchBadge}>
            <Text style={styles.pageText}>📖 {totalPage} Sayfa</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#4B5D4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  libraryCard: { width: 280, marginRight: 15, height: 115 },
  searchCard: { width: '100%', height: 115 },
  cover: { width: 65, height: 95, borderRadius: 8, backgroundColor: '#ACB9A8' },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#4B5D4E', lineHeight: 18 },
  author: { fontSize: 13, color: '#7D677D', marginTop: 2 },
  progressSection: { marginTop: 10 },
  barBackground: { height: 5, backgroundColor: '#EAE4D9', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4B5D4E' },
  progressText: { fontSize: 10, color: '#4B5D4E', marginTop: 4, fontWeight: 'bold' },
  searchBadge: { marginTop: 8, backgroundColor: '#F2F4F1', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pageText: { fontSize: 11, color: '#4B5D4E', fontWeight: '600' }
});