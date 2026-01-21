import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { showMessage } from "react-native-flash-message"; // Temalı bildirimler için
import { getSavedQuotes } from '../services/bookServices';

export default function QuotesSavedScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); // Sayfa her odaklandığında veriyi tazelemek için

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      fetchQuotes();
    }
  }, [isFocused]);

  async function fetchQuotes() {
    try {
      setLoading(true);
      const data = await getSavedQuotes();
      setQuotes(data);
    } catch (e: any) {
      showMessage({
        message: "Hata",
        description: "Alıntılar yüklenirken bir sorun oluştu.",
        type: "danger",
        backgroundColor: "#7D677D", // Plum Haze
      });
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.quoteBox}
      onPress={() => navigation.navigate('AddQuote', { 
        id: item.id, 
        quote: item.quote_text, 
        bookTitle: item.book_title, 
        mode: 'edit' 
      })} // Düzenleme moduna gider
    >
      <Text style={styles.quoteText}>"{item.quote_text}"</Text>
      <View style={styles.footerRow}>
        <Text style={styles.bookTitle}>— {item.book_title}</Text>
        <Text style={styles.editHint}>Düzenlemek için dokun</Text>
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alıntı Defterim</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={quotes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('../assets/Cat_playing_animation.json')} // Boş durum animasyonu
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.emptyText}>Henüz hiç alıntı yapmamışsın.</Text>
            <Text style={styles.emptySub}>Okuduğun kitaplardaki etkileyici cümleleri burada toplayabilirsin.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#EAE4D9' }, // Chiffon
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAE4D9' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#D9BBA9', // Apricot
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4B5D4E' }, // Evergreen
  backBtn: { position: 'absolute', left: 20, top: 60 },
  backBtnText: { color: '#7D677D', fontWeight: 'bold' }, // Plum Haze
  listContent: { padding: 20, flexGrow: 1 },
  quoteBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#D9BBA9', // Apricot
    elevation: 3,
    shadowColor: '#4B5D4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quoteText: {
    fontSize: 16,
    color: '#4B5D4E',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  bookTitle: {
    fontSize: 13,
    color: '#7D677D',
    fontWeight: 'bold',
    flex: 1,
  },
  editHint: {
    fontSize: 10,
    color: '#ACB9A8', // Sage Green
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  lottie: { width: 200, height: 200 },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5D4E',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#7D677D',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
});