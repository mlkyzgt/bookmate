import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function QuotesScreen() {
  const navigation = useNavigation();

  // ------------------------------------------------------------
  // Quotes DB'den okunacak
  // Backend/API varsa buradan çekilecek
  // ------------------------------------------------------------
  const [quotes, setQuotes] = useState([
    'Quto 1',
    'Quote 2',
    'Quote 3',
    'Extra quote 1',
    'Extra quote 2',
  ]);

  const deleteQuote = index => {
    Alert.alert('Delete Quote', 'Are you sure you want to delete this quote?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // ------------------------------------------------------------
          // Quote DB’den silinecek
          // ------------------------------------------------------------
          const updated = [...quotes];
          updated.splice(index, 1);
          setQuotes(updated);
        },
      },
    ]);
  };

  const editQuote = (quote: string, index: number) => {
    // ------------------------------------------------------------
    // Düzenleme ekranına yönlendirme
    // ------------------------------------------------------------
    navigation.navigate('AddQuote', {
      quote,
      index,
      mode: 'edit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Quotes</Text>

      {quotes.map((q, i) => (
        <TouchableOpacity
          key={i}
          style={styles.quoteBox}
          onPress={() => editQuote(q, i)} // Tek tık → Düzenle
          onLongPress={() => deleteQuote(i)} // Uzun bas → Sil
        >
          <Text style={styles.quoteText}>{q}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F8FAFF'},
  header: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  quoteBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  quoteText: {fontSize: 15, fontStyle: 'italic', color: '#333'},
});
