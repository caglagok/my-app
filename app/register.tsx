import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { register } from '../services/authService';

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor!');
      return;
    }

    try {
      const response = await register(username, email, password);
      console.log('Kayıt başarılı:', response);
      Alert.alert('Başarılı', 'Kayıt işlemi başarılı!');
      // örnek: navigation.navigate('Login')
    } catch (error) {
      console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
      Alert.alert('Hata', 'Kayıt işlemi sırasında bir hata oluştu.');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Kullanıcı Adı</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı adınızı girin"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email adresinizi girin"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />

      <Text>Şifre</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifrenizi girin"
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />

      <Text>Şifre (Tekrar)</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifrenizi tekrar girin"
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <Button title="Kayıt Ol" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
