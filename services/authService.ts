//authServices.ts
import { API_URL } from '../config';

// Giriş Yapma fonksiyonu
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email, // Burada email'i doğru gönderiyoruz
        sifre: password, // backend'e uygun olarak şifreyi 'sifre' olarak gönderiyoruz
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Giriş başarısız.');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Kayıt Olma fonksiyonu
export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kullanici_adi: username,
        email,
        sifre: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kayıt başarısız.');
    }

    return await response.json();
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};
