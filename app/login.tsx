import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../services/authService';
import axios from 'axios';
import { API_URL } from '../config';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email veya şifre boş olamaz.");
      return;
    }
  
    try {
      const userData = await login(email, password); // login fonksiyonu çağrılıyor
      console.log('Login success:', userData);
      router.replace('/HomePage'); // Başarılı giriş sonrası yönlendirme
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Geçersiz email veya şifre'); // Hata mesajı
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Giriş Yap" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  link: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});