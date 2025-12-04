import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function QuotesSavedScreen() {
  // ------------------------------------------------------------
  // Kullanıcının kaydettiği alıntılar veritabanından çekilecek.
  // Şu an ekran mock olarak boş dönüyor.
  // Quotes endpoint'i yazıldığında burada API isteği ile
  // kullanıcının kayıtlı alıntıları getirilecek.
  // ------------------------------------------------------------

  // ŞU ANKİ DURUM: Mock – veri olmadığı için geçici placeholder
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Quotes Saved Screen (Mock)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 20},
});
