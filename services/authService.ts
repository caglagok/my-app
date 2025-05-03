//services/authServices.ts
import { API_URL } from '../config';

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password, 
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
export const register = async (username: string, email: string, password: string) => {
  try {
    console.log('Register gönderilen:', { username, email, password });

    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username, 
        email,
        password, 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Register backend error:', errorData); 
      throw new Error(errorData.message || 'Kayıt başarısız.');
    }

    return await response.json();
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};
