// types/gameTypes.ts
export interface Player {
  _id: string;
  username: string;
}
  
export interface Score {
  player: Player;
  score: number;
}
  
export interface ActiveGame {
  _id: string;
  type: '2dk' | '5dk' | '12saat' | '24saat';
  players: Player[];
  currentTurn: Player;
  startedAt: string;
  endedAt: string | null;
  isActive: boolean;
  scores: Score[];
} 
export type LetterTile = {
  letter: string;
  point: number;
};
  
export type PlacedTile = {
  row: number;
  col: number;
  letter: string;
};
  