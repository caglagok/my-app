//register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '../services/authService';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await register(username, email, password);
      Alert.alert('Başarılı', 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kayıt başarısız.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Şifre</Text>
      <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Kayıt Ol" onPress={handleRegister} />

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={{ color: 'blue', marginTop: 10, textAlign: 'center' }}>Zaten hesabınız var mı? Giriş yapın</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
});
