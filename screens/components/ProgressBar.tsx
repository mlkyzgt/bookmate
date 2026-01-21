import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100 arası değer
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  // ------------------------------------------------------------
  // progress değeri servisten props olarak gelir
  // Progress backend'den yüzde olarak alınır
  // ------------------------------------------------------------

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${progress}%` }]} />
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
