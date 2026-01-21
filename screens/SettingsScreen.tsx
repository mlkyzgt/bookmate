import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message'; // Temalı bildirimler eklendi
import { getUserProfile } from '../services/bookServices';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUserProfile();
        if (data) {
          setUsername(data.username || '');
          setEmail(data.email || '');
          setAvatarUri(data.avatarUrl || 'https://via.placeholder.com/150');
        }
      } catch (error) {
        showMessage({
          message: 'Hata',
          description: 'Profil bilgileri yüklenemedi.',
          type: 'danger',
          backgroundColor: '#7D677D', // Plum Haze
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateAvatarByUrl = () => {
    if (imageUrlInput.trim() === '') {
      showMessage({
        message: 'Uyarı',
        description: 'Lütfen geçerli bir URL girin.',
        type: 'warning',
        backgroundColor: '#7D677D', // Plum Haze
      });
      return;
    }
    setAvatarUri(imageUrlInput.trim());
    setImageUrlInput('');
    showMessage({
      message: 'Önizleme Güncellendi',
      description:
        'Yeni profil fotoğrafını kaydetmek için alttaki butona basın.',
      type: 'info',
      backgroundColor: '#ACB9A8', // Sage Green
      color: '#4B5D4E',
    });
  };

  const handleSave = async () => {
    const user = auth().currentUser;
    if (!user) return;

    if (!username.trim()) {
      showMessage({
        message: 'Hata',
        description: 'Kullanıcı adı boş bırakılamaz.',
        type: 'warning',
        backgroundColor: '#7D677D',
      });
      return;
    }

    setSaving(true);
    try {
      // Auth profilini güncelle
      await user.updateProfile({ displayName: username });

      // Firestore dökümanını güncelle
      await firestore().collection('users').doc(user.uid).update({
        username: username,
        avatarUrl: avatarUri,
      });

      showMessage({
        message: 'Başarılı',
        description: 'Profil bilgileriniz güncellendi!',
        type: 'success',
        backgroundColor: '#ACB9A8', // Evergreen
        color: '#EAE4D9', // Chiffon
      });
    } catch (error) {
      showMessage({
        message: 'Hata',
        description: 'Bilgiler güncellenemedi.',
        type: 'danger',
        backgroundColor: '#7D677D',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4B5D4E" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Ayarları</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </View>
          <Text style={styles.avatarLabel}>Profil Fotoğrafını Özelleştir</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Yeni Fotoğraf URL'si</Text>
          <View style={styles.urlInputRow}>
            <TextInput
              placeholder="https://image-link.com/photo.jpg"
              placeholderTextColor="#ACB9A8"
              value={imageUrlInput}
              onChangeText={setImageUrlInput}
              style={styles.urlInput}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={updateAvatarByUrl}
            >
              <Text style={styles.updateBtnText}>Ekle</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Adınızı girin"
            placeholderTextColor="#ACB9A8"
          />

          <Text style={styles.label}>E-posta (Değiştirilemez)</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#EAE4D9" />
            ) : (
              <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#EAE4D9', // Chiffon
  },
  centerContainer: {
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
    borderColor: '#D9BBA9', // Apricot
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B5D4E', // Evergreen
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 55,
    backgroundColor: '#4B5D4E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#EAE4D9',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#4B5D4E',
    padding: 3,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  avatarLabel: {
    color: '#7D677D', // Plum Haze
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5D4E',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F8F6F2',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    color: '#4B5D4E',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#ACB9A8', // Sage Green
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D9BBA9',
    color: '#4B5D4E',
  },
  updateBtn: {
    backgroundColor: '#ACB9A8',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  updateBtnText: {
    color: '#4B5D4E',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4B5D4E',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 4,
  },
  saveButtonText: {
    color: '#EAE4D9',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
