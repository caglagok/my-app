import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { login } from '../services/authService';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const response = await login(email, password);
    console.log(response);
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Giriş Yap" onPress={handleLogin} />
      
      {/* Kayıt Ol linki */}
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={{ color: 'blue', marginTop: 10 }}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
