//new-games.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { joinOrCreateGame } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewGamePage = ({ navigation }: any) => {
  const router = useRouter();

  const startGame = async (durationMinutes: number) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('Kullanıcı ID bulunamadı.');
        return;
      }

      const gameData = await joinOrCreateGame(userId, durationMinutes);
      if (!gameData || !gameData.gameId) {
        console.error('Geçersiz oyun verisi:', gameData);
        return;
      }

      router.push({
        pathname: '/Game',
        params: {
          gameId: gameData.gameId,
          duration: durationMinutes.toString(),
        },
      });
    } catch (error) {
      console.log('Oyun başlatılamadı:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Süre Seç</Text>
      {[2, 5, 720, 1440].map((duration) => (
        <TouchableOpacity
          key={duration}
          style={styles.button}
          onPress={() => startGame(duration)}
        >
          <Text style={styles.buttonText}>
            {duration === 2 && '2 Dakika (Hızlı)'}
            {duration === 5 && '5 Dakika (Hızlı)'}
            {duration === 720 && '12 Saat (Genişletilmiş)'}
            {duration === 1440 && '24 Saat (Genişletilmiş)'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NewGamePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});