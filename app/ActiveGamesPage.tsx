import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const ActiveGamesPage = ({ navigation }: any) => {
  const [activeGames, setActiveGames] = useState([
    { id: '1', gameName: 'Kelime Mayınları', players: 'Ali, Ayşe' },
    { id: '2', gameName: 'Hızlı Kelimeler', players: 'Mehmet, Zeynep' },
    { id: '3', gameName: 'Zeka Testi', players: 'Ahmet, Elif' },
  ]);

  const renderItem = ({ item }: any) => (
    <View style={styles.gameItem}>
      <Text style={styles.gameName}>{item.gameName}</Text>
      <Text style={styles.gamePlayers}>Oyuncular: {item.players}</Text>
      <Button title="Oyna" onPress={() => navigation.navigate('GameDetails', { gameId: item.id })} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktif Oyunlar</Text>
      <FlatList
        data={activeGames}
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
  gamePlayers: { fontSize: 16, marginVertical: 5 },
});

export default ActiveGamesPage;
