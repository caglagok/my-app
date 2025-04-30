import React from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { letterPool } from '../constants/letterPool';

type JokerPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelectLetter: (letter: string) => void;
};

export const JokerPopup: React.FC<JokerPopupProps> = ({ isVisible, onClose, onSelectLetter }) => {
  const letters = Object.keys(letterPool).filter(letter => letter !== 'JOKER');

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Bir Harf Seçin</Text>

          <ScrollView contentContainerStyle={styles.letterGrid}>
            {letters.map((letter) => (
              <TouchableOpacity
                key={letter}
                style={styles.letterBox}
                onPress={() => onSelectLetter(letter)}
              >
                <Text style={styles.letterText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 340,
    maxHeight: 500,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterBox: {
    width: 50,
    height: 50,
    margin: 6,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointText: {
    fontSize: 12,
    color: '#555',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
