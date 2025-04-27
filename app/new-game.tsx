//new-games.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Animated, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { joinOrCreateGame } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const NewGamePage = ({ navigation }: any) => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef([
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50)
  ]).current;
  const titleAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(titleAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();

    Animated.stagger(150, [
      Animated.timing(slideAnim[0], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim[1], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim[2], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim[3], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const startGame = async (durationMinutes: number) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('Kullanıcı ID bulunamadı.');
        return;
      }

      // Button press animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();

      const gameData = await joinOrCreateGame(userId, durationMinutes);
      if (!gameData || !gameData.gameId) {
        console.error('Geçersiz oyun verisi:', gameData);
        return;
      }

      router.push({
        pathname: '/Game',
        params: {
          gameId: gameData.gameId,
          duration: durationMinutes.toString(),
        },
      });
    } catch (error) {
      console.log('Oyun başlatılamadı:', error);
    }
  };

  const durations: Array<{
    minutes: number;
    text: string;
    color: readonly [string, string];
  }> = [
    { minutes: 2, text: '2 Dakika (Hızlı)', color: ['#4a4eff', '#3023ae'] },
    { minutes: 5, text: '5 Dakika (Hızlı)', color: ['#00b4db', '#0083b0'] },
    { minutes: 720, text: '12 Saat (Genişletilmiş)', color: ['#f7971e', '#ffd200'] },
    { minutes: 1440, text: '24 Saat (Genişletilmiş)', color: ['#ff416c', '#ff4b2b'] }
  ];

  return (
    <ImageBackground 
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }} 
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.overlay} />
      
      <Animated.Text 
        style={[
          styles.title, 
          { opacity: fadeAnim, transform: [{ translateY: titleAnim }] }
        ]}
      >
        Oyun Süresini Seç
      </Animated.Text>

      <View style={styles.buttonsContainer}>
        {durations.map((item, index) => (
          <Animated.View 
            key={item.minutes}
            style={[
              styles.buttonContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim[index] }] 
              }
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => startGame(item.minutes)}
            >
              <LinearGradient
                colors={item.color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>{item.text}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ImageBackground>
  );
};

export default NewGamePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontFamily: 'Rubik',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: height * 0.15,
    marginBottom: 40,
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Rubik',
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});