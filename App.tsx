import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase ve Yerel Depolama Paketleri
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Temalı Bildirim Kütüphanesi
import FlashMessage from "react-native-flash-message";

// Ekran Importları
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import QuotesScreen from './screens/QuotesScreen';
import AddEditQuoteScreen from './screens/AddEditQuoteScreen';
import BookListScreen from './screens/BookListScreen';

// Firebase Başlatma Kontrolü
if (!firebase.apps.length) {
  firebase.initializeApp({});
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async userState => {
      setUser(userState);

      if (userState) {
        try {
          // Network hatasını önlemek için token alma işlemini hata kontrolüne aldık
          const token = await userState.getIdToken().catch(() => null);
          if (token) {
            await AsyncStorage.setItem('userToken', token);
          }
        } catch (e) {
          console.log('AsyncStorage Hatası:', e);
        }
      } else {
        await AsyncStorage.removeItem('userToken').catch(() => null);
      }

      if (initializing) setInitializing(false);
    });

    return subscriber;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B5D4E" /> 
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user === null ? (
            <Stack.Group>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="BookDetail" component={BookDetailScreen} />
              <Stack.Screen name="BookList" component={BookListScreen} />
              <Stack.Screen name="Quotes" component={QuotesScreen} />
              <Stack.Screen name="AddQuote" component={AddEditQuoteScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* Temaya Uygun Bildirim Bileşeni */}
      <FlashMessage 
        position="top" 
        floating={true}
        textStyle={{ fontWeight: '600' }}
        titleStyle={{ fontWeight: 'bold' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAE4D9', // Uygulamanın ana arka plan rengi (Chiffon)
  }
});