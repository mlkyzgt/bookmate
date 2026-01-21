import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal, // Custom Alert için eklendi
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { showMessage } from 'react-native-flash-message';
import { getUserBooks, removeBookFromLibrary } from '../services/bookServices';

export default function BookListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { type, title } = route.params || {};

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CUSTOM ALERT STATE ---
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      if (!type) return;
      try {
        setLoading(true);
        const data = await getUserBooks(type);
        setBooks(data);
      } catch (error) {
        console.log('Kitap listesi çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [type]);

  // Silme Onay Penceresini Açan Fonksiyon
  const handleRemovePress = (bookId: string, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setIsAlertVisible(true);
  };

  // Onay Verilince Silen Fonksiyon
  const confirmRemoveBook = () => {
    if (!selectedBook) return;

    setIsAlertVisible(false); // Pencereyi kapat

    removeBookFromLibrary(selectedBook.id)
      .then(() => {
        setBooks(prevBooks => prevBooks.filter(book => book.id !== selectedBook.id));
        showMessage({
          message: 'Kitap Silindi',
          description: `"${selectedBook.title}" kütüphanenizden kaldırıldı.`,
          type: 'success',
          backgroundColor: '#965353ff', // Mesajlarda bordo tonu
          color: '#EAE4D9',
        });
      })
      .catch(() => {
        showMessage({
          message: 'Hata',
          description: 'Kitap silinirken bir sorun oluştu.',
          type: 'danger',
          backgroundColor: '#7D677D',
        });
      })
      .finally(() => setSelectedBook(null));
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { id: item.id })}
      onLongPress={() => handleRemovePress(item.id, item.title)}
      delayLongPress={800}
      activeOpacity={0.8}
    >
      {item.thumbnail ? (
        <Image
          source={{ uri: item.thumbnail.replace('http://', 'https://') }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={[styles.thumbnail, styles.noImage]}>
          <Text style={{ color: '#7D677D', fontSize: 10 }}>Resim Yok</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {item.authors ? item.authors.join(', ') : 'Bilinmiyor'}
        </Text>
        {item.pagesRead > 0 && (
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>
              {item.pagesRead} sayfa okundu
            </Text>
          </View>
        )}
      </View>
      <View style={styles.actionArea}>
        <Text style={styles.deleteHint}>Silmek için basılı tut</Text>
        <Text style={styles.moreIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4B5D4E" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'Kitap Listesi'}</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('../assets/Cat_playing_animation.json')}
              autoPlay
              loop
              style={styles.lottieStyle}
            />
            <Text style={styles.emptyText}>Burası biraz sessiz...</Text>
            <Text style={styles.emptySubText}>
              Burada henüz bir kitap yok. Yeni kitaplar keşfetmeye ne dersin?
            </Text>
            <TouchableOpacity
              style={styles.discoverBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.discoverBtnText}>Kitap Keşfet</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* --- TEMAYA UYGUN ORTA ALERT (MODAL) --- */}
      <Modal visible={isAlertVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kitabı Kaldır</Text>
            <Text style={styles.modalMessage}>
              "{selectedBook?.title}" kitabını listenizden çıkarmak istediğinize emin misiniz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsAlertVisible(false)}
              >
                <Text style={styles.cancelBtnText}>VAZGEÇ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmRemoveBook}
              >
                <Text style={styles.confirmBtnText}>EVET, SİL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#EAE4D9' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9BBA9',
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4B5D4E' },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 55,
    backgroundColor: '#4B5D4E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  backButtonText: { color: '#EAE4D9', fontSize: 14, fontWeight: 'bold' },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    elevation: 3,
  },
  thumbnail: {
    width: 60,
    height: 85,
    borderRadius: 10,
    backgroundColor: '#ACB9A8',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9BBA9',
  },
  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#4B5D4E' },
  author: { marginTop: 4, fontSize: 13, color: '#7D677D' },
  pageBadge: {
    marginTop: 8,
    backgroundColor: '#F2F4F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ACB9A8',
  },
  pageBadgeText: { fontSize: 10, color: '#4B5D4E', fontWeight: '600' },
  actionArea: { alignItems: 'flex-end' },
  deleteHint: { fontSize: 8, color: '#ACB9A8', marginBottom: 5 },
  moreIcon: { fontSize: 24, color: '#D9BBA9' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAE4D9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 30,
  },
  lottieStyle: { width: 220, height: 220 },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B5D4E',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#7D677D',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  discoverBtn: {
    marginTop: 25,
    backgroundColor: '#ACB9A8',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 15,
  },
  discoverBtnText: { color: '#EAE4D9', fontWeight: 'bold' },

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
    color: '#550000', // Bordo Başlık
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
    backgroundColor: '#550000', // Bordo Buton
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold' },
});