import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { getActiveGames } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveGame } from '../types/gameTypes';

const ActiveGamesPage = ({ navigation }: any) => {
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('User ID bulunamadı.');
          setLoading(false);
          return;
        }
        const games = await getActiveGames(userId);
        console.log('Aktif oyunlar:', games);
        setActiveGames(games);
      } catch (error) {
        console.error('Aktif oyunlar çekilirken hata oluştu:', error);
        Alert.alert('Hata', 'Oyunlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktif Oyunlar</Text>
      <FlatList
        data={activeGames}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>Aktif oyun bulunamadı.</Text>}
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
