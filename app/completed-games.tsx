// app/completed-games.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompletedGames } from '../services/gameServices';
import { MotiView } from 'moti';

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

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100, type: 'timing' }}
      style={styles.gameItem}
    >
      <Text style={styles.gameName}>{item.gameName}</Text>
      <Text style={styles.gameWinner}>Kazanan: {item.winner}</Text>
      <Pressable
        onPress={() => navigation.navigate('GameDetails', { gameId: item._id })}
        style={({ pressed }) => [
          styles.detailButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Text style={styles.detailButtonText}>Detaylar</Text>
      </Pressable>
    </MotiView>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Biten Oyunlar</Text>
        <FlatList
          data={completedGames}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz biten oyun yok.</Text>
            </View>
          }
        />
      </View>
    </ImageBackground>
  );
};

export default CompletedGamesPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  gameItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  gameWinner: {
    fontSize: 16,
    marginTop: 8,
    color: '#7f8c8d',
  },
  detailButton: {
    marginTop: 15,
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
});