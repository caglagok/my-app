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
  try {
    const response = await axios.post(`${API_URL}/api/moves/createMove`, {
      gameId,
      playerId,
      placedTiles,
      boardState,
      firstMove
    });
    console.log('Hamle başarıyla gönderildi:', response.data);
    return response.data; 
  } catch (error: any) {
    console.error('Hamle gönderilemedi:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Hamle gönderilemedi.');
  }
};
export const getMovesByGame = async (gameId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/moves/getMovesByGame/${gameId}`);
    return response.data;
  } catch (error: any) {
    console.error('Hamle geçmişi alınamadı:', error.response?.data || error.message);
    throw new Error('Hamle geçmişi alınamadı.');
  }
};