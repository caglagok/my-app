// app/_layout.tsx
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Light mı Dark mı?
  
  const [loaded] = useFonts({
    Rubik: require('../assets/fonts/Rubik-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerTitleAlign: 'center', // Başlıklar ortalansın
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#f5f5f5',
          },
          headerTitleStyle: {
            fontFamily: 'SpaceMono', // Her başlığa özel font
            fontSize: 20,
          },
          animation: 'fade', // Sayfa geçiş animasyonu
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Giriş Yap" }} />
        <Stack.Screen name="register" options={{ title: "Kayıt Ol" }} />
        <Stack.Screen name="Game" options={{ title: "Oyun" }} />
        <Stack.Screen name="new-game" options={{ title: "Yeni Oyun" }} />
        <Stack.Screen name="active-games" options={{ title: "Aktif Oyunlar" }} />
        <Stack.Screen name="completed-games" options={{ title: "Biten Oyunlar" }} />
        <Stack.Screen name="HomePage" options={{ title: "Profilim" }} />
      </Stack>
    </ThemeProvider>
  );
}
