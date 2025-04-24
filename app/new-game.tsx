import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { joinOrCreateGame } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewGamePage = ({ navigation }: any) => {
  const router = useRouter();

  const startGame = async (durationMinutes: number) => {
    let type = '';
    if (durationMinutes === 2) type = '2dk';
    else if (durationMinutes === 5) type = '5dk';
    else if (durationMinutes === 720) type = '12saat';
    else if (durationMinutes === 1440) type = '24saat';

    try {
      const userId = await AsyncStorage.getItem('userId'); // ⬅️ Burada kullanıcı ID alınıyor

      if (!userId) {
        console.error("Kullanıcı ID bulunamadı.");
        return;
      }

      const gameData = await joinOrCreateGame(userId, durationMinutes); // ⬅️ userId parametresi eklendi

      router.push({
        pathname: '/Game',
        params: {
          gameId: gameData.gameId,
          duration: durationMinutes.toString(),
        }
      });
    } catch (error) {
      console.log('Oyun başlatılamadı:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Süre Seç</Text>
      <TouchableOpacity style={styles.button} onPress={() => startGame(2)}>
        <Text style={styles.buttonText}>2 Dakika (Hızlı)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => startGame(5)}>
        <Text style={styles.buttonText}>5 Dakika (Hızlı)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => startGame(720)}>
        <Text style={styles.buttonText}>12 Saat (Genişletilmiş)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => startGame(1440)}>
        <Text style={styles.buttonText}>24 Saat (Genişletilmiş)</Text>
      </TouchableOpacity>
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
    backgroundColor: '#4CAF50',  // Yeşil buton rengi
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
