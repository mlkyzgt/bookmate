import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message'; // Temalı bildirimler eklendi

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      showMessage({
        message: 'Eksik Bilgi',
        description: 'Lütfen tüm alanları doldurun.',
        type: 'warning',
        backgroundColor: '#7D677D', // Plum Haze
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await userCredential.user.updateProfile({ displayName: username });

      // Firestore üzerinde kullanıcı profilini oluştur
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          username,
          email,
          avatarUrl: 'https://via.placeholder.com/150',
          stats: { read: 0, reading: 0, toread: 0 },
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      showMessage({
        message: 'Başarılı! 🎉',
        description: 'Hesabınız başarıyla oluşturuldu.',
        type: 'success',
        backgroundColor: '#ACB9A8', // Evergreen
        color: '#EAE4D9', // Chiffon
      });
    } catch (error: any) {
      showMessage({
        message: 'Kayıt Hatası',
        description: error.message,
        type: 'danger',
        backgroundColor: '#7D677D', // Plum Haze
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Geri Dön</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>Bookmate</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı adınızı seçin"
            placeholderTextColor="#ACB9A8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@mail.com"
            placeholderTextColor="#ACB9A8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#ACB9A8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#EAE4D9" />
          ) : (
            <Text style={styles.registerButtonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.footerLink}
        >
          <Text style={styles.footerText}>
            Zaten hesabın var mı?{' '}
            <Text style={styles.footerBold}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAE4D9', // Chiffon
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 40,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 0,
  },
  backBtnText: {
    paddingTop: 15,
    paddingLeft: 5,
    color: '#7D677D', // Plum Haze
    fontWeight: '600',
    fontSize: 14,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4B5D4E', // Evergreen
    textAlign: 'center',
    letterSpacing: -1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5D4E', // Evergreen
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D9BBA9', // Apricot
    color: '#4B5D4E',
  },
  registerButton: {
    backgroundColor: '#4B5D4E', // Evergreen
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  registerButtonText: {
    color: '#EAE4D9', // Chiffon
    fontSize: 18,
    fontWeight: '700',
  },
  footerLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    color: '#7D677D', // Plum Haze
    fontSize: 15,
  },
  footerBold: {
    color: '#4B5D4E', // Evergreen
    fontWeight: '800',
  },
});
