//completed-games.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompletedGames } from '../services/gameServices';

const CompletedGamesPage = ({ navigation }: any) => {
  const [completedGames, setCompletedGames] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompletedGames = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const games = await getCompletedGames(userId);
        setCompletedGames(games);
      } catch (error) {
        console.error('Biten oyunlar alınamadı:', error);
      }
    };

    fetchCompletedGames();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.gameItem}>
      <Text style={styles.gameName}>{item.gameName}</Text>
      <Text style={styles.gameWinner}>Kazanan: {item.winner}</Text>
      <Button title="Detaylar" onPress={() => navigation.navigate('GameDetails', { gameId: item.id })} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biten Oyunlar</Text>
      <FlatList
        data={completedGames}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  gameItem: { marginBottom: 15 },
  gameName: { fontSize: 18, fontWeight: 'bold' },
  gameWinner: { fontSize: 16, marginVertical: 5 },
});

export default CompletedGamesPage;
