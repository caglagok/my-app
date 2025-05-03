//HomePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Animated, 
  Dimensions, 
  ScrollView,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../services/userServices';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomePage = ({ navigation, route }: any) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const username = route?.params?.username || 'Oyuncu';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonAnim = useRef([
    new Animated.Value(100),
    new Animated.Value(100),
    new Animated.Value(100)
  ]).current;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setLoading(false);
          return;
        }
        const profile = await getUserProfile(userId);
        setUserInfo(profile);
        setLoading(false);
        startAnimations();
      } catch (error) {
        console.error('Profil bilgileri alınamadı', error);
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.stagger(200, [
        Animated.timing(buttonAnim[0], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim[1], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim[2], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  };
  const calculateSuccessRate = () => {
    if (!userInfo) return 0;
    const { games_won, games_played } = userInfo;
    if (games_played === 0) return 0;
    return (games_won / games_played) * 100;
  };
  const getLevel = () => {
    if (!userInfo) return 1;
    const { games_won = 0 } = userInfo;
    return Math.floor(games_won / 5) + 1; 
  };
  const getExperience = () => {
    if (!userInfo) return 0;
    const { games_won = 0 } = userInfo;
    const level = getLevel();
    const totalExpForLevel = (level - 1) * 5;
    return ((games_won - totalExpForLevel) / 5) * 100;
  };  
  const handleButtonPress = (route: '/new-game' | '/active-games' | '/completed-games') => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(route);
    });
  };  
  if (loading) {
    return (
      <ImageBackground 
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
        style={styles.backgroundImage}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </ImageBackground>
    );
  }
  return (
    <ImageBackground 
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.container, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
                  style={styles.avatar}
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{getLevel()}</Text>
                </View>
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.username}>
                  {userInfo?.username || username}
                </Text>
                <View style={styles.statsRow}>
                  <Ionicons name="trophy" size={16} color="#FFD700" />
                  <Text style={styles.statText}>
                    Kazanılan: {userInfo?.games_won || 0}
                  </Text>
                </View>
                <View style={styles.statsRow}>
                  <Ionicons name="game-controller" size={16} color="#4CAF50" />
                  <Text style={styles.statText}>
                    Oynanan: {userInfo?.games_played || 0}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Seviye {getLevel()}</Text>
                <Text style={styles.progressPercentage}>{getExperience().toFixed(0)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${getExperience()}%` }]} />
              </View>
            </View>
            
            <View style={styles.badgesContainer}>
              <Text style={styles.badgesTitle}>Başarılarım</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
                <View style={[styles.badge, userInfo?.games_won >= 1 ? styles.badgeActive : styles.badgeInactive]}>
                  <Ionicons name="star" size={24} color={userInfo?.games_won >= 1 ? "#FFD700" : "#888"} />
                  <Text style={styles.badgeText}>İlk Zafer</Text>
                </View>
                <View style={[styles.badge, userInfo?.games_won >= 5 ? styles.badgeActive : styles.badgeInactive]}>
                  <Ionicons name="flame" size={24} color={userInfo?.games_won >= 5 ? "#FF6B6B" : "#888"} />
                  <Text style={styles.badgeText}>5 Galibiyet</Text>
                </View>
                <View style={[styles.badge, userInfo?.games_played >= 10 ? styles.badgeActive : styles.badgeInactive]}>
                  <Ionicons name="game-controller" size={24} color={userInfo?.games_played >= 10 ? "#4CAF50" : "#888"} />
                  <Text style={styles.badgeText}>10 Oyun</Text>
                </View>
                <View style={[styles.badge, calculateSuccessRate() >= 60 ? styles.badgeActive : styles.badgeInactive]}>
                  <Ionicons name="trophy" size={24} color={calculateSuccessRate() >= 60 ? "#C9A63B" : "#888"} />
                  <Text style={styles.badgeText}>En Az %60 Başarı</Text>
                </View>
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            <Animated.View style={{ transform: [{ translateX: buttonAnim[0] }] }}>
              <TouchableOpacity 
                style={styles.gameButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress('/new-game')}
              >
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.buttonGradient}
                  start={[0, 0]}
                  end={[1, 0]}
                >
                  <Ionicons name="add-circle" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Yeni Oyun</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ translateX: buttonAnim[1] }] }}>
              <TouchableOpacity 
                style={styles.gameButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress('/active-games')}
              >
                <LinearGradient
                  colors={['#2196F3', '#1565C0']}
                  style={styles.buttonGradient}
                  start={[0, 0]}
                  end={[1, 0]}
                >
                  <Ionicons name="play-circle" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Aktif Oyunlar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ translateX: buttonAnim[2] }] }}>
              <TouchableOpacity 
                style={styles.gameButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress('/completed-games')}
              >
                <LinearGradient
                  colors={['#9C27B0', '#6A1B9A']}
                  style={styles.buttonGradient}
                  start={[0, 0]}
                  end={[1, 0]}
                >
                  <Ionicons name="checkmark-done-circle" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Biten Oyunlar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Oyun İstatistikleri</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userInfo?.games_won || 0}</Text>
                <Text style={styles.statLabel}>Kazanılan</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{(userInfo?.games_played || 0) - (userInfo?.games_won || 0)}</Text>
                <Text style={styles.statLabel}>Kaybedilen</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Number.isNaN(calculateSuccessRate()) ? '0' : calculateSuccessRate().toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Başarı</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    fontFamily: 'Rubik',
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF9800',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  levelText: {
    fontFamily: 'Rubik',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  statText: {
    fontFamily: 'Rubik',
    marginLeft: 6,
    color: '#555',
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercentage: {
    color: '#4CAF50',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  badgesContainer: {
    marginBottom: 8,
  },
  badgesTitle: {
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  badgesScroll: {
    flexDirection: 'row',
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  badgeInactive: {
    backgroundColor: 'rgba(200, 200, 200, 0.9)',
    borderWidth: 1,
    borderColor: '#AAA',
  },
  badgeText: {
    fontFamily: 'Rubik',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  buttonsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  gameButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontFamily: 'Rubik',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  statsTitle: {
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});