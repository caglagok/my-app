import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultPage() {
  const {
    myScore,
    remainingLetters,
    opponentScore,
    winner,
    userId,
    opponentName,
  } = useLocalSearchParams();

  const isWinner = winner === userId;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oyun Sonucu</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Senin Puanın:</Text>
        <Text style={styles.value}>{myScore || '0'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Rakibin Puanı:</Text>
        <Text style={styles.value}>{opponentScore || '0'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Rakip:</Text>
        <Text style={styles.value}>{opponentName || 'Bilinmiyor'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Kalan Harf Sayın:</Text>
        <Text style={styles.value}>{remainingLetters || '0'}</Text>
      </View>

      <Text style={styles.winnerText}>
        {isWinner ? '🎉 Siz Kazandınız!' : '😞 Rakibiniz Kazandı'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, alignSelf: 'center' },
  row: { flexDirection: 'row', marginBottom: 10 },
  label: { fontSize: 18, fontWeight: '500', width: 150 },
  value: { fontSize: 18 },
  winnerText: { fontSize: 20, fontWeight: 'bold', marginTop: 30, alignSelf: 'center' },
});
