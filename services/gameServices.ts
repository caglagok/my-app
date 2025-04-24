//gameServices.ts
import { API_URL } from '../config';
import axios from 'axios';
  
// Yeni oyun başlat
export const joinOrCreateGame = async (userId: string, duration: number) => {
  const typeMap: { [key: number]: string } = {
    2: '2dk',
    5: '5dk',
    720: '12saat',
    1440: '24saat'
  };
  
  const type = typeMap[duration];
  
  try {
    const response = await axios.post(`${API_URL}/api/games/join-or-create`, {
      userId,
      type
    });
    return response.data;
  } catch (error: any) {
    console.error('Oyun başlatma hatası:', error.response?.data || error.message);
    throw error;
  }
}; 
 
// Oyun bilgisini getir
export const getGame = async (gameId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Oyun bilgisi alınamadı:', error);
    throw error;
  }
};
 
// Aktif oyunları listele
export const getActiveGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/games/active`);
    return response.data; // Aktif oyunlar
  } catch (error) {
    console.error('Aktif oyunlar alınamadı:', error);
    throw error;
  }
};

// Biten oyunları listele
export const getCompletedGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/games/completed`);
    return response.data; // Biten oyunlar
  } catch (error) {
    console.error('Biten oyunlar alınamadı:', error);
    throw error;
  }
};

// Tüm oyunları listele
export const getAllGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/games/all`);
    return response.data; // Tüm oyunlar
  } catch (error) {
    console.error('Tüm oyunlar alınamadı:', error);
    throw error;
  }
};