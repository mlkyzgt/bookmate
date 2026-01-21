import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            {/* HAYIR BUTONU */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>VAZGEÇ</Text>
            </TouchableOpacity>
            {/* EVET BUTONU */}
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>SİL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#EAE4D9', // Chiffon
    borderRadius: 25,
    padding: 25,
    borderWidth: 2,
    borderColor: '#D9BBA9', // Apricot
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ACB9A8', // Sage Green
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7D677D', // Plum Haze
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelBtn: {
    padding: 12,
  },
  cancelText: {
    color: '#7D677D',
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#4B5D4E', // Sage Green
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
