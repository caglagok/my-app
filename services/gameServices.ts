//gameServices.ts
import { API_URL } from '../config';
import axios from 'axios';
import { ActiveGame } from '../app/types';

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
export const getActiveGames = async (userId: string): Promise<ActiveGame[]> => {
  try {
    const response = await fetch(`${API_URL}/api/games/active/${userId}`);
    if (!response.ok) {
      throw new Error('Aktif oyunlar alınamadı');
    }
    const data = await response.json();
    return data; // Burada data'nın tipi ActiveGame[] olmalı
  } catch (error) {
    console.error('Veri alma hatası:', error);
    return []; // Hata durumunda boş dizi döneriz
  }
};

// Biten oyunları listele
export const getCompletedGames = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/games/completed?userId=${userId}`);
    return response.data;
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
// Oyun hamlesi yap
export const createMove = async (gameId: string, playerId: string, placedLetters: any[]) => {
  try {
    const response = await axios.post(`${API_URL}/api/moves/create-Move`, {
      gameId,
      playerId,
      placed: placedLetters,
    });
    return response.data;  // Güncellenmiş oyun verisi
  } catch (error: any) {
    console.error('Hamle yapma hatası:', error.response?.data || error.message);
    throw error;
  }
};