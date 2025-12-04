import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function ProgressBar({progress}: {progress: number}) {
  // ------------------------------------------------------------
  // progress değeri veritabanından gelecektir
  // Şu anda mock bir değer "prop" üzerinden geliyor
  // Kullanıcıya özel okuma ilerlemesi API'den alınacak
  // Progress, backend'den %0-100 arası gelecek
  // ------------------------------------------------------------

  return (
    <View style={styles.container}>
      <View style={[styles.fill, {width: `${progress}%`}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    backgroundColor: '#E6EEF8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#3D7BFF',
    borderRadius: 10,
  },
});
