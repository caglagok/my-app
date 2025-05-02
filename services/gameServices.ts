//gameServices.ts
import { API_URL } from '../config';
import axios from 'axios';
import { ActiveGame } from '../types/gameTypes';

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

    // Eğer oyun başlatıldıysa, oyun verilerini döndürüyoruz
    const { message, gameId, players, type: gameType, startedAt, endedAt, isActive, currentTurn , mines,rewards} = response.data;

    return {
      message,
      gameId,
      players,
      gameType,
      startedAt,
      endedAt,
      isActive,
      currentTurn,
      mines,
      rewards
    };
  } catch (error: any) {
    console.error('Oyun başlatma hatası:', error.response?.data || error.message);
    throw error;
  }
};
export const getGame = async (gameId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Oyun bilgisi alınamadı:', error);
    throw error;
  }
};
export const getActiveGames = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/games/active`, {
      params: { userId }
    });
    return response.data; 
  } catch (error) {
    console.error('Veri alma hatası:', error);
    return []; 
  }
};
export const getCompletedGames = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/games/completed`, {
      params: { userId }
    });
    return response.data;
  } catch (error: any) {
    console.error('Tamamlanmış oyunlar alınamadı:', error.response?.data || error.message);
    return [];
  }
};
export const getAllGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/games/all`);
    return response.data;
  } catch (error: any) {
    console.error('Tüm oyunlar alınamadı:', error.response?.data || error.message);
    throw error;
  }
};
export const surrenderGame = async (gameId: string, userId: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/games/${gameId}/surrender`, {
      userId
    });
    return response.data; // Burada 'winner' bilgisi dönecek
  } catch (error) {
    console.error('Teslim olma işlemi sırasında hata:', error);
    throw error; // Hata fırlatmak, UI tarafında yakalayabilmek için
  }
};
export const endGame = async (gameId: string, winnerId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/games/${gameId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, winnerId }),
    });
    if (!response.ok) {
      throw new Error("Oyun bitirme başarısız.");
    }
    return await response.json();
  } catch (error) {
    console.error("Oyun bitirme hatası:", error);
    throw error;
  }
};