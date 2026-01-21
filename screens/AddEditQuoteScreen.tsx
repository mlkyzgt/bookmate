import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal, // Stilli onay penceresi için eklendi
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { addQuote, updateQuote, deleteQuote } from '../services/bookServices';

export default function AddEditQuoteScreen() {
  // TypeScript hatasını önlemek için <any> kaldırıldı
  const navigation = useNavigation();
  const route = useRoute();

  const params = route.params || {};
  const { quote = '', mode = 'add', bookId, bookTitle, id } = params;

  const [quoteText, setQuoteText] = useState(quote);
  const [loading, setLoading] = useState(false);

  // --- CUSTOM ALERT STATE (Bordo Pencere Kontrolü) ---
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    if (quote) {
      setQuoteText(quote);
    }
  }, [quote]);

  // Kaydetme İşlemi
  const handleSave = async () => {
    if (!quoteText.trim()) {
      showMessage({
        message: 'Hata',
        description: 'Alıntı metni boş olamaz.',
        type: 'warning',
        backgroundColor: '#7D677D', // Plum Haze
      });
      return;
    }
    setLoading(true);
    try {
      if (mode === 'edit' && id) {
        await updateQuote(id, quoteText);
        showMessage({
          message: 'Başarılı',
          description: 'Alıntı güncellendi.',
          type: 'success',
          backgroundColor: '#4B5D4E', // Evergreen
        });
      } else if (bookId) {
        await addQuote(bookId, bookTitle || 'Bilinmeyen Kitap', quoteText);
        showMessage({
          message: 'Başarılı',
          description: 'Alıntı eklendi.',
          type: 'success',
          backgroundColor: '#4B5D4E',
        });
      }
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: 'Hata',
        description: 'İşlem başarısız oldu.',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    } finally {
      setLoading(false);
    }
  };

  // Onay Verilince Silen Fonksiyon
  const confirmDelete = async () => {
    if (!id) return;
    setIsAlertVisible(false);
    setLoading(true);
    try {
      await deleteQuote(id);
      showMessage({
        message: 'Alıntı Silindi',
        description: 'Seçilen alıntı başarıyla kaldırıldı.',
        type: 'success',
        backgroundColor: '#965353ff', // Bordo Mesaj Tonu
        color: '#EAE4D9',
      });
      navigation.goBack();
    } catch (e) {
      showMessage({
        message: 'Hata',
        description: 'Silinemedi.',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← İptal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'edit' ? 'Düzenle' : 'Yeni Alıntı'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.bookInfo}>{bookTitle || 'Kitap Bilgisi Yok'}</Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Kitaptan etkileyici bir cümle yazın..."
            placeholderTextColor="#ACB9A8"
            value={quoteText}
            onChangeText={setQuoteText}
            editable={!loading}
          />
        </View>

        <View style={styles.buttonRow}>
          {mode === 'edit' && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setIsAlertVisible(true)} // Bordo modalı tetikler
              disabled={loading}
            >
              <Text style={styles.deleteBtnText}>Sil</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#EAE4D9" />
            ) : (
              <Text style={styles.saveBtnText}>Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- TEMAYA UYGUN BORDO ALERT (MODAL) --- */}
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
    </KeyboardAvoidingView>
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
    borderColor: '#D9BBA9',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4B5D4E' },
  backBtn: { position: 'absolute', left: 20, top: 60 },
  backBtnText: { color: '#7D677D', fontWeight: 'bold' },
  content: { padding: 25 },
  bookInfo: {
    fontSize: 16,
    color: '#4B5D4E',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    minHeight: 200,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#4B5D4E',
    lineHeight: 24,
    textAlignVertical: 'top',
    height: '100%',
  },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 30 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#4B5D4E',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  saveBtnText: { color: '#EAE4D9', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#7D677D',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: { color: '#7D677D', fontWeight: 'bold' },

  /* --- MODAL STILLERI (BORDO TEMA) --- */
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
