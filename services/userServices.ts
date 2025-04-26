// services/userServices.ts
import axios from 'axios';
import { API_URL } from '../config';

export const getUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/profile?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Kullanıcı profili alınamadı:', error);
    throw error;
  }
};
