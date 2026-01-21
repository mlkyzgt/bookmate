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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message'; // Flash Message eklendi

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage({
        message: 'Eksik Bilgi',
        description: 'Lütfen e-posta ve şifrenizi girin.',
        type: 'warning',
        backgroundColor: '#7D677D', // Plum Haze
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      const userDoc = await firestore().collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            username: user.displayName || email.split('@')[0],
            email: user.email,
            avatarUrl: 'https://via.placeholder.com/150',
            stats: { read: 0, reading: 0, toread: 0 },
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      }

      showMessage({
        message: 'Hoş Geldiniz!',
        description: 'Başarıyla giriş yapıldı.',
        type: 'success',
        backgroundColor: '#ACB9A8', // Evergreen
        color: '#EAE4D9', // Chiffon
      });
    } catch (error: any) {
      let errorMessage = 'Giriş yapılamadı.';
      if (error.code === 'auth/user-not-found')
        errorMessage = 'Kullanıcı bulunamadı.';
      if (error.code === 'auth/wrong-password') errorMessage = 'Hatalı şifre.';
      if (error.code === 'auth/network-request-failed')
        errorMessage = 'İnternet bağlantınızı kontrol edin.';

      showMessage({
        message: 'Giriş Hatası',
        description: errorMessage,
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
      <View style={styles.innerContainer}>
        <Text style={styles.logo}>Bookmate</Text>

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
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#EAE4D9" />
          ) : (
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.footerLink}
        >
          <Text style={styles.footerText}>
            Hesabın yok mu? <Text style={styles.footerBold}>Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAE4D9', // Chiffon
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
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
  loginButton: {
    backgroundColor: '#4B5D4E', // Evergreen
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  loginButtonText: {
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
