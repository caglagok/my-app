import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, ImageBackground, FlatList, ActivityIndicator, Alert, Pressable } from 'react-native';
import { getActiveGames } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveGame } from '../types/gameTypes';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';  // useRouter import

const ActiveGamesPage = ({ navigation }: any) => {
  const router = useRouter();  // Router hook kullanıyoruz
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
        console.log('Aktif oyunlar:', games); // log full response
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
    const rakip = item.players.find((p) => p._id !== item.currentTurn._id);

    if (!rakip) {
      console.log('Rakip bulunamadı.');
      return null;  // Handle this case appropriately
    }

    // duration kontrolü
    const gameDuration = item.duration ? item.duration.toString() : 'Bilinmiyor';

    return (
      <View style={styles.gameItemContainer}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100, type: 'timing' }}
          style={styles.gameItem}
        >
          <Text style={styles.gameName}>Oyun Türü: {item.type}</Text>
          <Text style={styles.gamePlayers}>Rakip: {rakip?.username}</Text>
          <Text style={styles.gamePlayers}>Sıra: {item.currentTurn.username}</Text>
          <Text style={styles.gamePlayers}>Süre: {gameDuration}</Text>
          <Pressable
            onPress={() => router.push({ pathname: '/Game', params: { gameId: item._id, duration: gameDuration } })}  // Yönlendirme
            style={({ pressed }) => [
              styles.playButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Text style={styles.playButtonText}>Oyna</Text>
          </Pressable>
        </MotiView>
      </View>
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
      <Text style={styles.title}>Aktif Oyunlar</Text>
      <FlatList
        data={activeGames}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Aktif oyun bulunamadı.</Text>}
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
    borderRadius: 20, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  gameName: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  gamePlayers: { fontSize: 16, marginTop: 6, color: '#7f8c8d' },
  playButton: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12, 
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  playButtonText: {
    fontFamily: 'Rubik',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18, 
  },
  emptyText: {
    fontFamily: 'Rubik',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#7f8c8d',
  },
});
