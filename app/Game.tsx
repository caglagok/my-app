import React, { useEffect, useState } from 'react';
import kelimeData from '../assets/kelimeler.json';
import { useLocalSearchParams } from 'expo-router';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';

type LetterTile = {
  letter: string;
  point: number;
};

type PlacedTile = {
  row: number;
  col: number;
  letter: string;
};

const letterPool: { [key: string]: { count: number; point: number } } = {
  A: { count: 12, point: 1 }, B: { count: 2, point: 3 }, C: { count: 2, point: 4 },
  Ç: { count: 2, point: 4 }, D: { count: 2, point: 3 }, E: { count: 8, point: 1 },
  F: { count: 1, point: 7 }, G: { count: 1, point: 5 }, Ğ: { count: 1, point: 8 },
  H: { count: 1, point: 5 }, I: { count: 4, point: 2 }, İ: { count: 7, point: 1 },
  J: { count: 1, point: 10 }, K: { count: 7, point: 1 }, L: { count: 7, point: 1 },
  M: { count: 4, point: 2 }, N: { count: 5, point: 1 }, O: { count: 3, point: 2 },
  Ö: { count: 1, point: 7 }, P: { count: 1, point: 5 }, R: { count: 6, point: 1 },
  S: { count: 3, point: 2 }, Ş: { count: 2, point: 4 }, T: { count: 5, point: 1 },
  U: { count: 3, point: 2 }, Ü: { count: 2, point: 3 }, V: { count: 1, point: 7 },
  Y: { count: 2, point: 3 }, Z: { count: 2, point: 4 }, JOKER: { count: 2, point: 0 }
};

const bonusTiles = {
  K3: [{ row: 0, col: 0 }, { row: 0, col: 14 }, { row: 14, col: 0 }, { row: 14, col: 14 }],
  H3: [
    { row: 1, col: 5 }, { row: 1, col: 9 }, { row: 5, col: 1 }, { row: 5, col: 13 },
    { row: 9, col: 1 }, { row: 9, col: 13 }, { row: 13, col: 5 }, { row: 13, col: 9 }
  ],
  K2: [
    { row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }, { row: 4, col: 4 },
    { row: 10, col: 10 }, { row: 11, col: 11 }, { row: 12, col: 12 }, { row: 13, col: 13 },
    { row: 1, col: 13 }, { row: 2, col: 12 }, { row: 3, col: 11 }, { row: 4, col: 10 },
    { row: 10, col: 4 }, { row: 11, col: 3 }, { row: 12, col: 2 }, { row: 13, col: 1 }
  ],
  H2: [
    { row: 0, col: 3 }, { row: 0, col: 11 }, { row: 2, col: 6 }, { row: 2, col: 8 },
    { row: 3, col: 0 }, { row: 3, col: 7 }, { row: 3, col: 14 }, { row: 6, col: 2 },
    { row: 6, col: 6 }, { row: 6, col: 8 }, { row: 6, col: 12 }, { row: 7, col: 3 },
    { row: 7, col: 11 }, { row: 8, col: 2 }, { row: 8, col: 6 }, { row: 8, col: 8 },
    { row: 8, col: 12 }, { row: 11, col: 0 }, { row: 11, col: 7 }, { row: 11, col: 14 },
    { row: 12, col: 6 }, { row: 12, col: 8 }, { row: 14, col: 3 }, { row: 14, col: 11 }
  ],
  CENTER: [{ row: 7, col: 7 }]
};

const kelimeListesi: string[] = require('../assets/kelimeler.json');


const screenWidth = Dimensions.get('window').width;
const cellSize = Math.floor(screenWidth / 15); // 15x15 board
const tileWidth = Math.floor(screenWidth / 8); // Harf kartlarının genişliği
const tileHeight = tileWidth * 1.25; // Harf kartlarının yüksekliği
const fontScale = screenWidth / 400; // Ekran boyutuna göre ölçekleme

const generateRandomLetters = (count: number): LetterTile[] => {
  const allLetters: LetterTile[] = [];
  Object.entries(letterPool).forEach(([letter, { count, point }]) => {
    for (let i = 0; i < count; i++) {
      allLetters.push({ letter, point });
    }
  });
  const hand: LetterTile[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * allLetters.length);
    hand.push(allLetters[index]);
    allLetters.splice(index, 1);
  }
  return hand;
};

export default function Game() {
  const [playerHand, setPlayerHand] = useState<LetterTile[]>([]);
  const [board, setBoard] = useState<string[][]>(Array(15).fill(null).map(() => Array(15).fill('')));
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null);
  const [placedLetters, setPlacedLetters] = useState<PlacedTile[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [score, setScore] = useState<number>(0);
  const { duration } = useLocalSearchParams();
  const gameDuration = Number(duration);

  useEffect(() => {
    console.log("Oyun süresi (dakika):", gameDuration);
    setPlayerHand(generateRandomLetters(7));
  }, []);

  const getBonusType = (row: number, col: number): string => {
    if (bonusTiles.CENTER.some(tile => tile.row === row && tile.col === col)) return '★';
    if (bonusTiles.H3.some(tile => tile.row === row && tile.col === col)) return 'H3';
    if (bonusTiles.K3.some(tile => tile.row === row && tile.col === col)) return 'K3';
    if (bonusTiles.H2.some(tile => tile.row === row && tile.col === col)) return 'H2';
    if (bonusTiles.K2.some(tile => tile.row === row && tile.col === col)) return 'K2';
    return '';
  };

  const handleTilePress = (row: number, col: number) => {
    const existingIndex = placedLetters.findIndex(l => l.row === row && l.col === col);
    if (existingIndex !== -1) {
      const removed = placedLetters[existingIndex];
      setPlacedLetters(prev => prev.filter((_, i) => i !== existingIndex));
      const newBoard = [...board];
      newBoard[row][col] = '';
      setBoard(newBoard);
      setPlayerHand(prev => [...prev, { letter: removed.letter, point: letterPool[removed.letter].point }]);
    } else if (selectedLetterIndex !== null) {
      const letter = playerHand[selectedLetterIndex].letter;
      const updatedLetters = [...placedLetters, { row, col, letter }];
      setPlacedLetters(updatedLetters);
      const newBoard = [...board];
      newBoard[row][col] = letter;
      setBoard(newBoard);
      const newHand = [...playerHand];
      newHand.splice(selectedLetterIndex, 1);
      setPlayerHand(newHand);
      setSelectedLetterIndex(null);
      if (updatedLetters.length > 0) setShowConfirm(true);
    }
  };

  // Harf kartına basıldığında seçme işlemi
  const handleLetterPress = (index: number) => {
    setSelectedLetterIndex(index);
  };

  // Kelimenin geçerliliğini kontrol etme
  const kelimeGecerliMi = (kelime: string): boolean => {
    if (!Array.isArray(kelimeListesi)) {
      console.error('Kelime listesi uygun formatta değil.');
      return false;
    }
    return kelimeListesi.includes(kelime.toLowerCase());
  };
  
  // Kelime puanı hesaplama
  const kelimePuaniHesapla = (): number => {
    let kelime = '';
    let toplamPuan = 0;
    let kelimeKatsayi = 1;

    for (const tile of placedLetters) {
      const letter = tile.letter;
      const puan = letterPool[letter]?.point || 0;
      const bonus = getBonusType(tile.row, tile.col);

      if (bonus === 'H2') toplamPuan += puan * 2;
      else if (bonus === 'H3') toplamPuan += puan * 3;
      else toplamPuan += puan;

      if (bonus === 'K2') kelimeKatsayi *= 2;
      else if (bonus === 'K3') kelimeKatsayi *= 3;

      kelime += letter;
    }

    return toplamPuan * kelimeKatsayi;
  };
  
  // Kelime onaylama işlemi
  const onaylaKelime = () => {
    const kelime = placedLetters.map(k => k.letter).join('');
    if (kelimeGecerliMi(kelime)) {
      const puan = kelimePuaniHesapla();
      setScore(prev => prev + puan);
      Alert.alert("Tebrikler!", `"${kelime}" kelimesi kabul edildi.\n+${puan} puan`);
      const yeniHarfler = generateRandomLetters(placedLetters.length);
      setPlayerHand(prev => [...prev, ...yeniHarfler]);
      setPlacedLetters([]);
      setShowConfirm(false);
    } else {
      Alert.alert("Geçersiz Kelime", `"${kelime}" sözlükte bulunamadı.`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>Puan: {score}</Text>
        <Text style={styles.remaining}>
          Kalan Harf: {Object.values(letterPool).reduce((acc, { count }) => acc + count, 0)}
        </Text>
      </View>

      <ScrollView style={styles.boardContainer}>
        <View style={styles.board}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const bonus = getBonusType(rowIndex, colIndex);
              return (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    bonus === 'H2' && styles.h2,
                    bonus === 'K2' && styles.k2,
                    bonus === 'H3' && styles.h3,
                    bonus === 'K3' && styles.k3,
                    bonus === '★' && styles.center
                  ]}
                  onPress={() => handleTilePress(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>{bonus}</Text>
                  {cell !== '' && (
                    <View style={styles.letterCard}>
                      <Text style={styles.tileText}>{cell}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.hand}>
        {playerHand.map((tile, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tile,
              selectedLetterIndex === index && { backgroundColor: '#f59e0b' }
            ]}
            onPress={() => handleLetterPress(index)}
          >
            <Text style={styles.tileText}>{tile.letter}</Text>
            <Text style={styles.tilePoint}>{tile.point}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showConfirm && (
        <TouchableOpacity style={styles.confirmButton} onPress={onaylaKelime}>
          <Text style={styles.confirmText}>✅ Onayla</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', paddingTop: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 10,
  },
  score: { fontSize: 16, fontWeight: 'bold' },
  remaining: { fontSize: 16, fontWeight: 'bold', color: 'orange' },
  boardContainer: { flex: 1 },
  board: {
    flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', width: screenWidth
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 0.5,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 10 * fontScale,
    fontWeight: '600',
  },
  h2: { backgroundColor: '#add8e6' },
  k2: { backgroundColor: '#ffc0cb' },
  h3: { backgroundColor: '#87ceeb' },
  k3: { backgroundColor: '#ff69b4' },
  center: { backgroundColor: '#fbbf24' },
  hand: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', padding: 10,
  },
  tile: {
    width: tileWidth,
    height: tileHeight,
    backgroundColor: '#fcd34d',
    margin: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
  },
  tilePoint: {
    fontSize: 12 * fontScale,
    color: '#333',
  },
  letterCard: {
    backgroundColor: '#fcd34d',
    borderRadius: 4,
    width: cellSize - 4,
    height: cellSize - 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  confirmButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10 * fontScale,
    paddingHorizontal: 20 * fontScale,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16 * fontScale,
  },
});