//active-games.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { getActiveGames } from '../services/gameServices'; // Service dosyası açıp bu fonksiyonu yazacağız
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveGame } from '../types/gameTypes';

const ActiveGamesPage = ({ navigation }: any) => {
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]); // ActiveGame[] tipi kullanıyoruz

  useEffect(() => {
    const fetchActiveGames = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const games = await getActiveGames(userId);
      setActiveGames(games);
    };
    fetchActiveGames();
  }, []);

  const renderItem = ({ item }: { item: ActiveGame }) => {
    const rakip = item.players.find((p) => p._id !== item.currentTurn._id);
    
    return (
      <View style={styles.gameItem}>
        <Text style={styles.gameName}>Oyun Türü: {item.type}</Text>
        <Text style={styles.gamePlayers}>Rakip: {rakip?.username}</Text>
        <Text style={styles.gamePlayers}>Sıra: {item.currentTurn.username}</Text>
        <Button title="Oyna" onPress={() => navigation.navigate('GameDetails', { gameId: item._id })} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktif Oyunlar</Text>
      <FlatList
        data={activeGames}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ActiveGamesPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  gameItem: { marginBottom: 15 },
  gameName: { fontSize: 18, fontWeight: 'bold' },
  gamePlayers: { fontSize: 16, marginVertical: 5 },
});
