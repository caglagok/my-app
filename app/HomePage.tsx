import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomePage = ({ navigation, route }: any) => {
  // route.params kontrol edilerek güvenli bir şekilde username alınır.
  const username = route?.params?.username || 'Oyuncu';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoş Geldin, {username}!</Text>
      <Button title="Yeni Oyun" onPress={() => navigation.navigate('NewGamePage')} />
      <Button title="Aktif Oyunlar" onPress={() => {}} />
      <Button title="Biten Oyunlar" onPress={() => {}} />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
