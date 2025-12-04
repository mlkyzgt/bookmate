import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function AddQuoteScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const mode = route.params?.mode ?? 'add'; // "add" or "edit"
  const initialQuote = route.params?.quote ?? '';

  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (mode === 'edit') {
      setQuote(initialQuote);
    }
  }, [mode, initialQuote]);

  const onSave = () => {
    if (!quote.trim()) return;

    if (mode === 'add') {
      // ------------------------------------------------------------
      //Yeni quote DB'ye kaydedilecek
      //Backend'e yeni quote POST edilecek
      // ------------------------------------------------------------
      console.log('Quote added:', quote);
    } else if (mode === 'edit') {
      // ------------------------------------------------------------
      // Varolan quote DB'de güncellenecek
      // Backend'e PUT/PATCH ile update gönderilecek
      // ------------------------------------------------------------
      console.log('Quote updated:', quote);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {mode === 'edit' ? 'Edit Quote' : 'Add New Quote'}
      </Text>

      <TextInput
        style={styles.input}
        value={quote}
        onChangeText={setQuote}
        placeholder="Enter quote..."
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>
          {mode === 'edit' ? 'Save Changes' : 'Add Quote'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F8FAFF'},
  header: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    height: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
