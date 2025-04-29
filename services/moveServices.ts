// services/moveServices.ts
import { API_URL } from '../config';
import axios from 'axios';

export const submitMove = async (
    gameId: string,
    playerId: string,
    placedTiles: { x: number, y: number, letter: string }[],
    boardState: string[][],
    firstMove: boolean
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/moves/create-Move`, {
        gameId,
        playerId,
        placedTiles,
        boardState,
        firstMove,
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Hamle gönderirken hata:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Hamle gönderilirken hata oluştu.');
    }
  };
  
  // Belirli bir oyunun hamlelerini getir
  export const getMovesByGame = async (gameId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/moves/getMovesByGame/${gameId}`);
      return response.data;
    } catch (error: any) {
      console.error('Hamle geçmişi alınamadı:', error.response?.data || error.message);
      throw new Error('Hamle geçmişi alınamadı.');
    }
  };