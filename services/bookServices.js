import axios from 'axios';
import auth from '@react-native-firebase/auth'; 
import firestore from '@react-native-firebase/firestore';

const USE_MOCK_DATA = false; 

/**
 * 1. PROFİL İŞLEMLERİ
 */
export const getUserProfile = async () => {
  const currentUser = auth().currentUser;
  if (!currentUser) return null;

  try {
    const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      return userDoc.data();
    }
    return { 
      username: currentUser.displayName || "Okur", 
      email: currentUser.email,
      avatarUrl: "https://via.placeholder.com/150",
      stats: { read: 0, reading: 0, toread: 0 }
    };
  } catch (error) {
    return null;
  }
};

/**
 * 2. GOOGLE BOOKS API ARAMASI
 */
export const searchBooks = async (query) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
    );

    if (!response.data.items) return [];

    return response.data.items.map((item) => {
      const info = item.volumeInfo || {};
      return {
        id: item.id,
        title: info.title || "Başlıksız Kitap",
        authors: Array.isArray(info.authors) ? info.authors : ["Bilinmeyen Yazar"],
        thumbnail: info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
        pageCount: info.pageCount || 0,
        description: info.description || "",
        publisher: info.publisher || "Bilinmiyor",
        publishedDate: info.publishedDate || "Bilinmiyor",
        isbn: (info.industryIdentifiers && info.industryIdentifiers[0]?.identifier) || "Yok",
        volumeInfo: info 
      };
    });
  } catch (error) {
    return [];
  }
};

/**
 * 3. KÜTÜPHANE KAYIT VE GÜNCELLEME (GÜNCELLENDİ)
 */
export const updateBookInLibrary = async (bookData: any) => {
  const user = auth().currentUser;
  if (!user) return;

  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('myBooks')
      .doc(bookData.id)
      .set({
        id: bookData.id,
        title: bookData.title,
        authors: bookData.authors,
        thumbnail: bookData.thumbnail,
        status: bookData.status, // Burası 'toread', 'reading' veya 'read' değerini alır
        totalPage: bookData.totalPage,
        pagesRead: bookData.pagesRead,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  } catch (error) {
    console.error("Firestore Güncelleme Hatası:", error);
    throw error;
  }
};
/**
 * 4. KÜTÜPHANE LİSTELEME
 */
export const getUserBooks = async (status) => {
  const userId = auth().currentUser?.uid;
  if (!userId) return [];

  const snapshot = await firestore()
    .collection('users')
    .doc(userId)
    .collection('myBooks')
    .where('status', '==', status)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * 5. ALINTI (QUOTE) İŞLEMLERİ
 */
export const getSavedQuotes = async () => {
  const userId = auth().currentUser?.uid;
  if (!userId) return [];

  const snapshot = await firestore()
    .collection('users')
    .doc(userId)
    .collection('quotes')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addQuote = async (bookId, bookTitle, quoteText) => {
  const userId = auth().currentUser?.uid;
  if (!userId) return;

  await firestore().collection('users').doc(userId).collection('quotes').add({
    book_id: bookId,
    book_title: bookTitle,
    quote_text: quoteText,
    createdAt: firestore.FieldValue.serverTimestamp()
  });
};

export const deleteQuote = async (quoteId) => {
  const user = auth().currentUser;
  return await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('quotes')
    .doc(quoteId)
    .delete();
};

export const removeBookFromLibrary = async (bookId) => {
  const user = auth().currentUser;
  if (!user) throw new Error("Kullanıcı oturumu açılmamış.");

  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('myBooks')
      .doc(bookId)
      .delete();
    return true;
  } catch (error) {
    console.error("Kitap silme hatası:", error);
    throw error;
  }
};

export const updateQuote = async (quoteId: string, newText: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('Kullanıcı oturumu bulunamadı.');

  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('quotes')
      .doc(quoteId)
      .update({
        quote_text: newText,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Alıntı güncellenirken hata oluştu:', error);
    throw error;
  }
};