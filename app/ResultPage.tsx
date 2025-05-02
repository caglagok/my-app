import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultPage() {
  const { myScore, remainingLetters, opponentScore, winner } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oyun Sonucu</Text>
      <Text>Senin Puanın: {myScore}</Text>
      <Text>Kalan Harf Sayın: {remainingLetters}</Text>
      <Text>Rakibin Puanı: {opponentScore}</Text>
      <Text>Kazanan: {winner === 'senin_userId' ? "Siz Kazandınız" : "Rakibiniz Kazandı"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
