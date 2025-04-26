//app/register.tsx

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
    if (!username || !email || !password) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const userData = await register(username, email, password);
      console.log('Kayıt başarılı:', userData);
      Alert.alert('Başarılı', 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      router.replace('/login'); // Başarılı kayıt sonrası login ekranına
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı adınızı girin"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email adresinizi girin"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Şifre</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Şifrenizi girin"
      />

      <Button title="Kayıt Ol" onPress={handleRegister} />

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={{ color: 'blue', marginTop: 10, textAlign: 'center' }}>
          Zaten hesabınız var mı? Giriş yapın
        </Text>
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
