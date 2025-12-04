import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ------------------------------------------------------------
  // Kayıt endpointi eklenecek.
  // POST /auth/register
  // Backend doğru cevap döndüğünde Login ekranına yönlendirilecek.
  // Kullanıcı kaydı DB'de oluşturulacak.
  // Email UNIQUE olacak, şifre hash’lenerek saklanacak.
  // ------------------------------------------------------------

  const handleRegister = () => {
    // ------------------------------------------------------------
    // handleRegister içinde gerçek API çağrısı yapılacak.
    // Şimdilik mock navigation çalışıyor.
    // ------------------------------------------------------------
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.logo}>Bookmate</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      {/* INPUTS */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#777"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* REGISTER BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* LOGIN NAV */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A3D7C',
    alignSelf: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E6F0',
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#1A3D7C',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
  linkBold: {
    color: '#1A3D7C',
    fontWeight: '700',
  },
});
