import { LetterTile } from '../types/gameTypes';
import { letterPool } from '../constants/letterPool';

const letters = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

export const generateRandomLetters = (count: number): LetterTile[] => {
  const allLetters: LetterTile[] = [];
  Object.entries(letterPool).forEach(([letter, { count, point }]) => {
    for (let i = 0; i < count; i++) {
      allLetters.push({ letter, point });
    }
  });
  const hand: LetterTile[] = [];
  for (let i = 0; i < count; i++) {
    if (allLetters.length === 0) break;
    const index = Math.floor(Math.random() * allLetters.length);
    hand.push(allLetters[index]);
    allLetters.splice(index, 1);
  }
  return hand;
};
