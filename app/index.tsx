import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground 
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHv5feza9-EKXxCpRmKsoxzlZcc7IUEAHCg&s' }}
      style={styles.backgroundImage}
    >
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <MotiView
            key={i}
            from={{ 
              opacity: 0.3,
              scale: Math.random() * 0.5 + 0.5,
              translateX: Math.random() * width,
              translateY: Math.random() * height
            }}
            animate={{ 
              translateY: [Math.random() * height, -50],
              rotate: [`${Math.random() * 360}deg`, `${Math.random() * 360 + 180}deg`]
            }}
            transition={{ 
              loop: true,
              type: 'timing',
              duration: Math.random() * 8000 + 5000,
              easing: Easing.linear
            }}
            style={[
              styles.particle,
              { 
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                borderRadius: Math.random() > 0.5 ? 50 : 4
              }
            ]}
          />
        ))}
      </View>

      <View style={[styles.contentContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Logo animasyonu */}
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1500 }}
          style={styles.logoContainer}
        >
          <Text style={styles.logoEmoji}>🎮</Text>
          <MotiText
            from={{ translateY: -10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 400, duration: 800 }}
            style={styles.title}
          >
            Kelime Mayınları
          </MotiText>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600, duration: 800 }}
        >
          <Text style={styles.subtitle}>Eğlenceli ve öğretici bir kelime oyunu!</Text>
          <MotiView
            from={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1000, duration: 800 }}
            style={styles.divider}
          />
        </MotiView>

        <View style={styles.buttons}>
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 1200, duration: 700 }}
          >
            <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 1400, duration: 700 }}
          >
            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => router.push('/register')}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </MotiView>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.6)',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 200,
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttons: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  registerButton: {
    backgroundColor: 'rgba(249, 115, 22, 0.9)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  versionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  }
});
