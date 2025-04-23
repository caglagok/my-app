// components/GameDurationOptions.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GameDurationProps {
  onSelectDuration: (duration: string) => void;
}

const GameDurationOptions: React.FC<GameDurationProps> = ({ onSelectDuration }) => {
  return (
    <React.Fragment>
      <TouchableOpacity onPress={() => onSelectDuration('2 minutes')} style={styles.optionButton}>
        <Text style={styles.buttonText}>2 Minutes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectDuration('5 minutes')} style={styles.optionButton}>
        <Text style={styles.buttonText}>5 Minutes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectDuration('12 hours')} style={styles.optionButton}>
        <Text style={styles.buttonText}>12 Hours</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectDuration('24 hours')} style={styles.optionButton}>
        <Text style={styles.buttonText}>24 Hours</Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default GameDurationOptions;
