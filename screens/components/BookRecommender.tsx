import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

const GROQ_API_KEY = 'KENDİ API KEYİNİZİ GİRİNİZ';

export default function BookRecommender({ onSelectBook }) {
  const [bookName, setBookName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!bookName.trim()) {
      Alert.alert('Hata', 'Lütfen bir kitap ismi girin.');
      return;
    }
    setLoading(true);
    setRecommendations([]);
    Keyboard.dismiss();

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: 'Sen bir kitap tavsiye asistanısın.' },
              {
                role: 'user',
                content: `Bana '${bookName}' kitabına benzeyen 10 kitap öner. SADECE bir JSON listesi döndür. Format: {"books": ["Kitap Adı - Yazar"]}.`,
              },
            ],
            response_format: { type: 'json_object' },
          }),
        },
      );

      const data = await response.json();
      const parsedData = JSON.parse(data.choices[0].message.content);
      setRecommendations(parsedData.books || []);
    } catch (error) {
      Alert.alert('Hata', 'Öneriler şu an alınamıyor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Kitap Önerisi</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Benzer kitap ismi girin..."
          placeholderTextColor="#7D677D"
          value={bookName}
          onChangeText={setBookName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={getRecommendations}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#EAE4D9" size="small" />
          ) : (
            <Text style={styles.buttonText}>Bul</Text>
          )}
        </TouchableOpacity>
      </View>

      {recommendations.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.recommendationCard}
          onPress={() => {
            const titleOnly = item.split(' - ')[0];
            onSelectBook && onSelectBook(titleOnly);
          }}
        >
          <Text style={styles.recommendationText}>📖 {item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(172, 185, 168, 0.15)', // Şeffaf Sage
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ACB9A8', // Sage
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4B5D4E', // Evergreen
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9BBA9', // Apricot
    overflow: 'hidden',
    alignItems: 'center',
    paddingRight: 5,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 15,
    color: '#4B5D4E',
  },
  button: {
    backgroundColor: '#4B5D4E', // Evergreen
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#EAE4D9', // Chiffon
    fontWeight: 'bold',
  },
  recommendationCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EAE4D9', // Chiffon
  },
  recommendationText: {
    fontSize: 14,
    color: '#7D677D', // Plum Haze
  },
});
