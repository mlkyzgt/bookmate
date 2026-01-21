import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal, // Custom Alert için eklendi
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { getSavedQuotes, deleteQuote } from '../services/bookServices';
import LottieView from 'lottie-react-native';

export default function QuotesScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CUSTOM ALERT STATE ---
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (isFocused) fetchQuotes();
  }, [isFocused]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await getSavedQuotes();
      setQuotes(data);
    } catch (e) {
      showMessage({
        message: 'Hata',
        description: 'Alıntılar yüklenemedi.',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    } finally {
      setLoading(false);
    }
  };

  // Silme Onayını Başlatan Fonksiyon
  const deleteQuoteHandler = (id: number) => {
    setSelectedId(id);
    setIsAlertVisible(true); // Özel orta pencereyi açar
  };

  // Onay Verilince Silen Fonksiyon
  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      setIsAlertVisible(false);
      await deleteQuote(selectedId);
      fetchQuotes();
      showMessage({
        message: 'Başarılı',
        description: 'Alıntı silindi.',
        type: 'success',
        backgroundColor: '#965353ff',
      });
    } catch (e) {
      showMessage({
        message: 'Hata',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ACB9A8" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kitap Alıntıları</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('../assets/feather.json')}
              autoPlay
              loop
              style={styles.lottieStyle}
            />
            <Text style={styles.emptyTitle}>Henüz alıntı yok</Text>
            <Text style={styles.description}>
              Henüz seni etkileyen bir cümle kaydetmemişsin. Okuduğun kitaplarda
              en sevdiğin kısımları buraya not alabilirsin.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Kitaplara Göz At</Text>
            </TouchableOpacity>
          </View>
        ) : (
          quotes.map(q => (
            <TouchableOpacity
              key={q.id.toString()}
              style={styles.quoteCard}
              onPress={() =>
                navigation.navigate('AddQuote', {
                  quote: q.quote_text,
                  id: q.id,
                  mode: 'edit',
                  bookTitle: q.book_title,
                })
              }
              onLongPress={() => deleteQuoteHandler(q.id)}
            >
              <Text style={styles.quoteText}>"{q.quote_text}"</Text>
              <View style={styles.quoteFooter}>
                <Text style={styles.bookTitle}>— {q.book_title}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* --- TEMAYA UYGUN ORTA ALERT (MODAL) --- */}
      <Modal visible={isAlertVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alıntıyı Sil</Text>
            <Text style={styles.modalMessage}>
              Bu alıntıyı kalıcı olarak silmek istediğinize emin misiniz?
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
                onPress={confirmDelete}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAE4D9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#D9BBA9',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4B5D4E' },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 55,
    backgroundColor: '#4B5D4E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  backBtnText: { color: '#FFF', fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#ACB9A8',
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4B5D4E',
    lineHeight: 24,
  },
  quoteFooter: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  bookTitle: {
    fontSize: 13,
    color: '#7D677D',
    fontWeight: '700',
    textAlign: 'right',
  },
  exploreBtn: {
    marginTop: 25,
    backgroundColor: '#4B5D4E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  exploreBtnText: { color: '#EAE4D9', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  lottieStyle: { width: 180, height: 180 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#4B5D4E' },

  /* --- MODAL STILLERI --- */
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
  cancelBtnText: { color: '#000000ff', fontWeight: 'bold' },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#550000',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold' },
  description: {
    fontSize: 14,
    color: '#7D677D',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
