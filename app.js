import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://<IP_ADRESİN>:5000')
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
