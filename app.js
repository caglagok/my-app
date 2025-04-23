//app.js
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from './config';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/`)  // API_URL'yi burada kullan
      .then(response => setMessage(response.data))
      .catch(error => {
        console.log("Bağlantı hatası", error);
        setMessage("Backend'e bağlanılamadı.");
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
