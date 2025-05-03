import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Mine = { row: number; col: number; type: string };
type Reward = { row: number; col: number; type: string };

export default function ResultPage() {
  const {
    myScore,
    remainingLetters,
    opponentScore,
    winner,
    userId,
    opponentName,
    matchedMines,
    matchedRewards,
  } = useLocalSearchParams();

  const isWinner = winner === userId;
  const parseMinesOrRewards = (data: string | string[]): Mine[] | Reward[] => {
    if (Array.isArray(data)) {
      return data.map((item) => {
        const match = item.match(/\[(\d+),\s*(\d+)\s*-\s*(\w+)\]/);
        if (match) {
          const [_, row, col, type] = match;
          return { row: parseInt(row, 10), col: parseInt(col, 10), type };
        }
        return null;
      }).filter(Boolean) as Mine[] | Reward[];
    }
    return [];
  };

  const mines: Mine[] = parseMinesOrRewards(matchedMines);
  const rewards: Reward[] = parseMinesOrRewards(matchedRewards);

  return (
    <ImageBackground 
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }} // Gerçek bir oyun arka planı URL'si buraya eklenmelidir
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <Text style={styles.title}>Oyun Sonucu</Text>
  
        <View style={styles.resultContainer}>
          {/* Sol taraf - oyuncu */}
          <View style={[styles.playerCard, isWinner ? styles.winnerCard : styles.loserCard]}>
            <Text style={styles.playerTitle}>Sen</Text>
            <Text style={styles.scoreText}>{myScore || '0'}</Text>
            {isWinner && <Text style={styles.winnerBadge}>🏆 Kazanan</Text>}
          </View>
  
          {/* VS işareti */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
  
          {/* Sağ taraf - rakip */}
          <View style={[styles.playerCard, !isWinner ? styles.winnerCard : styles.loserCard]}>
            <Text style={styles.playerTitle}>{opponentName || 'Rakip'}</Text>
            <Text style={styles.scoreText}>{opponentScore || '0'}</Text>
            {isWinner || <Text style={styles.winnerBadge}>🏆 Kazanan</Text>}
          </View>
        </View>
  
        {/* Oyun detayları */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Oyun Detayları</Text>
          <Text style={styles.infoText}>Kalan Harfler: {remainingLetters || '0'}</Text>
          <View style={styles.detailsRow}>
            {/* Mayınlar */}
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsHeader}>Mayınlar</Text>
              <Text style={styles.detailsContent}>
                {mines.length > 0
                  ? mines.map((mine, index) => (
                      <Text key={index}>
                        {`[${mine.row}, ${mine.col} - ${mine.type}] `}
                      </Text>
                    ))
                  : 'Yok'}
              </Text>
            </View>
  
            {/* Ödüller */}
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsHeader}>Ödüller</Text>
              <Text style={styles.detailsContent}>
                {rewards.length > 0
                  ? rewards.map((reward, index) => (
                      <Text key={index}>
                        {`[${reward.row}, ${reward.col} - ${reward.type}] `}
                      </Text>
                    ))
                  : 'Yok'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );  
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  playerCard: {
    width: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  winnerCard: {
    borderWidth: 2,
    borderColor: 'gold',
  },
  loserCard: {
    opacity: 0.9,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8, 
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  winnerBadge: {
    backgroundColor: 'gold',
    color: '#333',
    fontWeight: 'bold',
    padding: 6,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
  },
  vsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsColumn: {
    width: '48%',
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detailsContent: {
    fontSize: 14,
    color: '#444',
  },
});