//HomePage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../services/userServices';

const HomePage = ({ navigation, route }: any) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const username = route?.params?.username || 'Oyuncu';

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const profile = await getUserProfile(userId);
        setUserInfo(profile);
      } catch (error) {
        console.error('Profil bilgileri alınamadı', error);
      }
    };

    fetchUserInfo();
  }, []);

  const calculateSuccessRate = () => {
    if (!userInfo) return 0;
    const { gamesWon, gamesPlayed } = userInfo;
    if (gamesPlayed === 0) return 0;
    return (gamesWon / gamesPlayed) * 100;
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.title}>Hoş Geldin, {userInfo.username}!</Text>
          <Text style={styles.infoText}>Başarı Yüzdesi: {calculateSuccessRate().toFixed(2)}%</Text>
        </>
      ) : (
        <Text style={styles.title}>Yükleniyor...</Text>
      )}

      <Button title="Yeni Oyun" onPress={() => router.push('/new-game')} />
      <Button title="Aktif Oyunlar" onPress={() => router.push('/active-games')} />
      <Button title="Biten Oyunlar" onPress={() => router.push('/completed-games')} />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
});
