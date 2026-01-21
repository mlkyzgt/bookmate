import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import { showMessage } from 'react-native-flash-message'; // Temalı bildirimler için eklendi
import { updateBookInLibrary } from '../services/bookServices';

export default function BookDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params;

  const [book, setBook] = useState<any>(null);
  const [dbBook, setDbBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [inputPages, setInputPages] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiRef = useRef<LottieView>(null);

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`,
      );
      const data = await res.json();
      setBook(data);

      if (user) {
        const doc = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('myBooks')
          .doc(id)
          .get();

        if (doc.exists) {
          const fbData = doc.data();
          setDbBook(fbData);
          setInputPages(fbData?.pagesRead?.toString() || '0');
        }
      }
    } catch (e) {
      showMessage({
        message: 'Hata',
        description: 'Kitap detayları yüklenemedi.',
        type: 'danger',
        backgroundColor: '#7D677D', // Plum Haze rengi
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'toread' | 'reading' | 'read') => {
    setAdding(true);
    try {
      const totalPage = book?.volumeInfo?.pageCount || 0;
      const initialPagesRead = status === 'read' ? totalPage : 0;

      await updateBookInLibrary({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
        status: status,
        totalPage: totalPage,
        pagesRead: initialPagesRead,
      });

      await fetchAllData();

      if (status === 'read') {
        setShowConfetti(true);
      } else {
        showMessage({
          message: 'Başarılı',
          description: 'Kitap listenize eklendi.',
          type: 'success',
          backgroundColor: '#ACB9A8', // Evergreen rengi
          color: '#EAE4D9', // Chiffon rengi
        });
      }
    } catch (e) {
      showMessage({
        message: 'İşlem Başarısız',
        description: 'Kitap kütüphaneye eklenirken bir hata oluştu.',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    } finally {
      setAdding(false);
    }
  };

  const handlePageUpdate = async () => {
    const pages = parseInt(inputPages);
    const total = book?.volumeInfo?.pageCount || 0;

    if (isNaN(pages) || pages < 0 || pages > total) {
      showMessage({
        message: 'Geçersiz Sayfa',
        description: `Lütfen 0 ile ${total} arasında bir sayı giriniz.`,
        type: 'warning',
        backgroundColor: '#7D677D',
      });
      return;
    }

    setAdding(true);
    try {
      const isFinished = pages === total;
      await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('myBooks')
        .doc(id)
        .update({
          pagesRead: pages,
          status: isFinished ? 'read' : 'reading',
        });

      if (isFinished) {
        setShowConfetti(true);
      } else {
        showMessage({
          message: 'Güncellendi',
          description: 'Okuma ilerlemeniz başarıyla kaydedildi.',
          type: 'info',
          backgroundColor: '#ACB9A8',
        });
      }
      fetchAllData();
    } catch (e) {
      showMessage({
        message: 'Güncelleme Hatası',
        description: 'Sayfa sayısı kaydedilemedi.',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4B5D4E" />
      </View>
    );
  }

  const vInfo = book.volumeInfo;
  const progress = dbBook
    ? Math.round((dbBook.pagesRead / (vInfo.pageCount || 1)) * 100)
    : 0;
  const isbn13 = vInfo.industryIdentifiers?.find(
    (i: any) => i.type === 'ISBN_13',
  )?.identifier;
  const isbn10 = vInfo.industryIdentifiers?.find(
    (i: any) => i.type === 'ISBN_10',
  )?.identifier;

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>← Geri</Text>
            </TouchableOpacity>
            <Image
              source={{
                uri: vInfo.imageLinks?.thumbnail?.replace(
                  'http://',
                  'https://',
                ),
              }}
              style={styles.cover}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{vInfo.title}</Text>
            <Text style={styles.author}>
              {vInfo.authors?.join(', ') || 'Bilinmeyen Yazar'}
            </Text>

            {/* İlerleme Takibi */}
            {dbBook && (
              <View style={styles.trackerContainer}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Okuma İlerlemen</Text>
                  <Text style={styles.progressValue}>%{progress}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.pageInput}
                    keyboardType="numeric"
                    value={inputPages}
                    onChangeText={setInputPages}
                    placeholder="Kaçıncı sayfadasın?"
                    placeholderTextColor="#ACB9A8"
                  />
                  <TouchableOpacity
                    style={styles.updateBtn}
                    onPress={handlePageUpdate}
                  >
                    <Text style={styles.updateBtnText}>Güncelle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Bilgi Kutuları */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>TÜR</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {vInfo.categories?.join(', ') || 'Belirtilmemiş'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>SAYFA</Text>
                <Text style={styles.infoValue}>
                  {vInfo.pageCount || '-'} Sayfa
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>YAYINEVİ</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {vInfo.publisher || 'Bilinmiyor'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ISBN</Text>
                <Text style={styles.infoValue}>
                  {isbn13 || isbn10 || 'Mevcut Değil'}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Kitabın Konusu</Text>
            <Text style={styles.description}>
              {vInfo.description?.replace(/<[^>]*>?/gm, '') ||
                'Bu kitap için bir özet bulunmuyor.'}
            </Text>

            {dbBook && (
              <TouchableOpacity
                style={styles.quoteBtn}
                onPress={() =>
                  navigation.navigate('AddQuote', {
                    bookId: id,
                    bookTitle: vInfo.title,
                    mode: 'add',
                  })
                }
              >
                <Text style={styles.quoteBtnText}>💬 Alıntı Ekle</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {!dbBook && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.choiceBtn, { backgroundColor: '#ACB9A8' }]}
            onPress={() => handleStatusUpdate('toread')}
          >
            <Text style={styles.choiceText}>Okunacak</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceBtn, { backgroundColor: '#4B5D4E' }]}
            onPress={() => handleStatusUpdate('reading')}
          >
            <Text style={styles.choiceText}>Okuyorum</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceBtn, { backgroundColor: '#7D677D' }]}
            onPress={() => handleStatusUpdate('read')}
          >
            <Text style={styles.choiceText}>Okundu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Konfeti Katmanı */}
      {showConfetti && (
        <View style={styles.fullScreenOverlay}>
          <LottieView
            ref={confettiRef}
            source={require('../assets/congratulations.json')}
            autoPlay
            loop={false}
            onAnimationFinish={() => {
              setTimeout(() => setShowConfetti(false), 2500);
            }}
            style={styles.fullScreenLottie}
          />
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>MUHTEŞEM!</Text>
            <Text style={styles.overlaySub}>Bir kitabı daha tamamladın</Text>
            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={() => setShowConfetti(false)}
            >
              <Text style={styles.dismissBtnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    height: 280,
    backgroundColor: '#4B5D4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  backBtnText: { color: '#EAE4D9', fontWeight: 'bold', fontSize: 16 },
  cover: { width: 130, height: 190, borderRadius: 8, elevation: 15 },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B5D4E',
    textAlign: 'center',
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: '#7D677D',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#D9BBA9',
  },
  infoItem: { width: '50%', padding: 10 },
  infoLabel: {
    fontSize: 11,
    color: '#ACB9A8',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, color: '#4B5D4E', fontWeight: '600' },
  trackerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: { fontWeight: 'bold', color: '#4B5D4E' },
  progressValue: { fontWeight: 'bold', color: '#ACB9A8' },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressFill: { height: '100%', backgroundColor: '#ACB9A8' },
  inputRow: { flexDirection: 'row', gap: 10 },
  pageInput: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    color: '#4B5D4E',
  },
  updateBtn: {
    backgroundColor: '#4B5D4E',
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  updateBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5D4E',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#4B5D4E',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
  quoteBtn: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D677D',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  quoteBtnText: { color: '#7D677D', fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    gap: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  choiceBtn: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: { color: '#fff', fontWeight: 'bold' },
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(75, 93, 78, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  fullScreenLottie: { width: '100%', height: '100%', position: 'absolute' },
  overlayContent: { alignItems: 'center', padding: 30 },
  overlayTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#EAE4D9',
    marginBottom: 10,
  },
  overlaySub: {
    fontSize: 18,
    color: '#ACB9A8',
    textAlign: 'center',
    marginBottom: 30,
  },
  dismissBtn: {
    backgroundColor: '#EAE4D9',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 15,
  },
  dismissBtnText: { color: '#4B5D4E', fontWeight: 'bold', fontSize: 16 },
});
