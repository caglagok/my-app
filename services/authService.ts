import { API_URL } from '../config';

// Giriş Yapma fonksiyonu
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Giriş başarısız');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Kayıt Olma fonksiyonu
export const register = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Kayıt başarısız');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};
