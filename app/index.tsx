import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300, duration: 800 }}
      >
        <Text style={styles.title}>🎉 Kelime Mayınları</Text>
        <Text style={styles.subtitle}>Eğlenceli ve öğretici bir kelime oyunu!</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 600, duration: 600 }}
        style={styles.buttons}
      >
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => router.push('/register')}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'linear-gradient(160deg, #fdfbfb 0%, #ebedee 100%)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 30,
  },
  buttons: {
    width: '100%',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#f97316',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
