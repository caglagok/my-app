import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const CompletedGamesPage = ({ navigation }: any) => {
  const [completedGames, setCompletedGames] = useState([
    { id: '1', gameName: 'Kelime Mayınları', winner: 'Ali' },
    { id: '2', gameName: 'Hızlı Kelimeler', winner: 'Zeynep' },
  ]);

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
