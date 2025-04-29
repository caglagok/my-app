// services/moveServices.ts
import { API_URL } from '../config';
import axios from 'axios';

export const submitMove = async (
  gameId: string,
  playerId: string,
  placedTiles: { x: number; y: number; letter: string }[],
  boardState: string[][],
  firstMove: boolean
) => {
  const response = await fetch(`${API_URL}/api/moves/createMove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameId,
      playerId,
      placedTiles,
      boardState,
      firstMove
    }),
  });
  console.log(JSON.stringify({
    gameId,
    playerId,
    placedTiles,
    boardState,
    firstMove
  }, null, 2));
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Hamle gönderilemedi.');
  }

  return await response.json();
};
{/*
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
  */}
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