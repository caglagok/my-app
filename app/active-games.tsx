import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, ImageBackground, FlatList, ActivityIndicator, Alert, Pressable, ScrollView } from 'react-native';
import { getActiveGames } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveGame } from '../types/gameTypes';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router'; 

const ActiveGamesPage = ({ navigation }: any) => {
  const router = useRouter();
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (!id) {
          console.log('User ID bulunamadı.');
          setLoading(false);
          return;
        }
        setUserId(id);
        const games = await getActiveGames(id);
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

  const renderItem = ({ item, index }: { item: ActiveGame; index: number }) => {
    if (!userId) return null;
  
    const rakip = item.players.find(p => p._id !== userId);
    const oyuncu = item.players.find(p => p._id === userId);
    if (!rakip || !oyuncu) return null;
  
    const kullaniciSkoru = item.scores.find(s => s.player._id === userId)?.score || 0;
    const rakipSkoru = item.scores.find(s => s.player._id === rakip._id)?.score || 0;
    const siradaKim = item.currentTurn._id === userId ? 'Sen' : rakip.username;
  
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 100, type: 'timing' }}
        style={styles.gameItem}
      >
        <Text style={styles.gameType}>Oyun Süresi: {item.type}</Text>
        <View style={styles.scoresContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.label}>Senin Skorun</Text>
            <Text style={styles.score}>{kullaniciSkoru}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.label}>Rakip: {rakip.username}</Text>
            <Text style={styles.score}>{rakipSkoru}</Text>
          </View>
        </View>
        <Text style={styles.turnInfo}>Sıra: {siradaKim}</Text>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/Game', params: { gameId: item._id, duration: item.type } })
          }
          style={({ pressed }) => [styles.playButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.playButtonText}>Oyna</Text>
        </Pressable>
      </MotiView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
      style={styles.background}
      resizeMode="cover"
    >
      <FlatList
        data={activeGames}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Aktif oyun bulunamadı.</Text>}
        ListHeaderComponent={
          <Text style={styles.title}>Aktif Oyunlar</Text>
        }
      />
    </ImageBackground>
  );  
};

export default ActiveGamesPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gameItemContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
    width: '100%', 
  },
  container: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: 40, paddingHorizontal: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  title: { fontFamily: 'Rubik', fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  gameItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 16,
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
  turnInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#2980b9',
  },
  playButton: {
    marginTop: 16,
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButtonText: {
    fontFamily: 'Rubik',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },  
  emptyText: {
    fontFamily: 'Rubik',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#7f8c8d',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
