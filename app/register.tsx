import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { register } from '../services/authService';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Şifreler uyuşmuyor!');
      return;
    }

    try {
      const response = await register(email, password);
      console.log('Kayıt başarılı:', response);
      // Burada kullanıcıyı giriş ekranına yönlendirebilirsiniz
    } catch (error) {
      console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
    }
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Text>Confirm Password</Text>
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <Button title="Kayıt Ol" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
