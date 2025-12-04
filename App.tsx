import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import BooksReadScreen from './screens/BooksReadScreen';
import InProgressScreen from './screens/InProgressScreen';
import ToReadScreen from './screens/ToReadScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import AddQuoteScreen from './screens/AddEditQuoteScreen';
import QuotesScreen from './screens/QuotesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* Profile sub-screens */}
        <Stack.Screen name="BooksRead" component={BooksReadScreen} />
        <Stack.Screen name="InProgress" component={InProgressScreen} />
        <Stack.Screen name="ToRead" component={ToReadScreen} />

        {/* Book detail + quotes */}
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
        <Stack.Screen name="AddQuote" component={AddQuoteScreen} />
        <Stack.Screen name="Quotes" component={QuotesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
