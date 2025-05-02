// app/completed-games.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompletedGames } from '../services/gameServices';
import { MotiView } from 'moti';

const CompletedGamesPage = () => {
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
  const getResultStyle = (result: string) => {
    switch (result) {
      case 'kazandın':
        return styles.kazandin;
      case 'kaybettin':
        return styles.kaybettin;
      case 'berabere':
        return styles.berabere;
      default:
        return {};
    }
  };  
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100, type: 'timing' }}
      style={styles.gameItem}
    >
      <Text style={styles.gameType}>Oyun Süresi: {item.gameType}</Text>
      <View style={styles.scoresContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>Senin Skorun</Text>
          <Text style={styles.score}>{item.userScore}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>Rakip: {item.opponentUsername}</Text>
          <Text style={styles.score}>{item.opponentScore}</Text>
        </View>
      </View>
      <Text style={[styles.resultText, getResultStyle(item.result)]}>
        Sonuç: {item.result.toUpperCase()}
      </Text>
    </MotiView>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View>
        <Text style={styles.title}>Biten Oyunlar</Text>
        <FlatList
          data={completedGames}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
  title: {
    fontFamily: 'Rubik',
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
  gameType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreBox: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  kazandin: {
    color: '#27ae60',
  },  
  kaybettin: {
    color: '#e74c3c',
  },
  berabere: {
    color: '#f39c12',
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Rubik',
    fontSize: 18,
    color: '#7f8c8d',
  },
});
