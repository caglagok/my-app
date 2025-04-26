//Game.tsx
import React, { useEffect, useState } from 'react';
import kelimeData from '../assets/kelimeler.json';
import { useLocalSearchParams } from 'expo-router';
import { getGame, createMove } from '../services/gameServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LetterTile, PlacedTile } from '../types/gameTypes';
import { letterPool } from '../constants/letterPool';
import { bonusTiles } from '../constants/bonusTiles';

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
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [gameLoaded, setGameLoaded] = useState(false);
  const [remainingLetters, setRemainingLetters] = useState(0);
  const { duration, gameId: routeGameId } = useLocalSearchParams();
   // Oyun verilerini yükle
   useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert("Hata", "Kullanıcı ID bulunamadı. Lütfen tekrar giriş yapın.");
          return;
        }

        setUserId(storedUserId);

        // Oyun bilgisini al
        if (routeGameId) {
          const gameData = await getGame(routeGameId as string);
          if (gameData) {
            setBoard(gameData.board || Array(15).fill(null).map(() => Array(15).fill('')));
            setScore(gameData.score || 0);
            setGameId(routeGameId as string);
            
            // Kalan harf sayısını hesapla
            const totalLetters = Object.values(letterPool).reduce((acc, { count }) => acc + count, 0);
            const usedLetters = gameData.moves 
              ? gameData.moves.reduce((acc: number, move: any) => acc + move.placed.length, 0) 
              : 0;
            setRemainingLetters(totalLetters - usedLetters);
          }
        }

        // Başlangıç eli oluştur
        if (playerHand.length === 0) {
          setPlayerHand(generateRandomLetters(7));
        }
        
        setGameLoaded(true);
      } catch (error) {
        console.error("Oyun verisi yüklenirken hata:", error);
        Alert.alert("Hata", "Oyun verisi alınamadı. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [routeGameId]);


  const handleCellPress = (row: number, col: number) => {
    if (selectedLetterIndex === null || board[row][col] !== '') return;
    const selectedLetter = playerHand[selectedLetterIndex];
    const updatedBoard = [...board];
    updatedBoard[row][col] = selectedLetter.letter;
    setBoard(updatedBoard);
    setPlacedLetters([...placedLetters, { row, col, letter: selectedLetter.letter }]);
    const updatedHand = [...playerHand];
    updatedHand.splice(selectedLetterIndex, 1);
    setPlayerHand(updatedHand);
    setSelectedLetterIndex(null);
    setShowConfirm(true);
  };
  
  // Bonus taş tipini döndürür
  const getBonusType = (row: number, col: number): string => {
    if (bonusTiles.CENTER.some(tile => tile.row === row && tile.col === col)) return '★';
    if (bonusTiles.H3.some(tile => tile.row === row && tile.col === col)) return 'H3';
    if (bonusTiles.K3.some(tile => tile.row === row && tile.col === col)) return 'K3';
    if (bonusTiles.H2.some(tile => tile.row === row && tile.col === col)) return 'H2';
    if (bonusTiles.K2.some(tile => tile.row === row && tile.col === col)) return 'K2';
    return '';
  };

  // Taş yerleştirme işlemi
  const handleTilePress = (row: number, col: number) => {
    // Eğer hücre doluysa ve yerleştirilen harflerden biriyse harfi geri al
    const existingIndex = placedLetters.findIndex(l => l.row === row && l.col === col);
    
    if (board[row][col] !== '' && existingIndex === -1) {
      // Daha önce oynanmış kalıcı bir taş, dokunulamaz
      return;
    }
    
    if (existingIndex !== -1) {
      // Yerleştirilen harfi geri al
      const removed = placedLetters[existingIndex];
      setPlacedLetters(prev => prev.filter((_, i) => i !== existingIndex));
      
      // Tahtadan harfi kaldır
      const newBoard = [...board];
      newBoard[row][col] = '';
      setBoard(newBoard);
      
      // Harfi ele geri ekle
      setPlayerHand(prev => [...prev, { 
        letter: removed.letter, 
        point: letterPool[removed.letter]?.point || 0 
      }]);
      
      // Yerleştirilen harf kalmadıysa onaylama butonunu kaldır
      if (placedLetters.length <= 1) {
        setShowConfirm(false);
      }
    } else if (selectedLetterIndex !== null && board[row][col] === '') {
      // Seçilen harfi tahtaya yerleştir
      const letter = playerHand[selectedLetterIndex].letter;
      
      // Yerleştirilen harfler listesine ekle
      const updatedLetters = [...placedLetters, { row, col, letter }];
      setPlacedLetters(updatedLetters);
      
      // Tahtayı güncelle
      const newBoard = [...board];
      newBoard[row][col] = letter;
      setBoard(newBoard);
      
      // Elden harfi çıkar
      const newHand = [...playerHand];
      newHand.splice(selectedLetterIndex, 1);
      setPlayerHand(newHand);
      
      // Seçimi temizle
      setSelectedLetterIndex(null);
      
      // Onaylama butonunu göster
      if (updatedLetters.length > 0) {
        setShowConfirm(true);
      }
    }
  };

  // Eldeki harfe tıklama
  const handleLetterPress = (index: number) => {
    setSelectedLetterIndex(prevIndex => prevIndex === index ? null : index);
  };

  // Hamleyi sunucuya gönder
  const handleMoveConfirm = async () => {
    if (placedLetters.length === 0) {
      Alert.alert("Uyarı", "Lütfen en az bir harf yerleştirin.");
      return;
    }

    setIsLoading(true);
    try {
      // Backend'e gönderilecek verileri formatla
      const formattedPlacedLetters = placedLetters.map(tile => ({
        x: tile.row,
        y: tile.col,
        letter: tile.letter
      }));

      // Hamleyi sunucuya gönder
      const moveData = await createMove(gameId, userId, formattedPlacedLetters);
      
      // Başarılı hamle sonrası işlemler
      if (moveData) {
        // Güncellenmiş tahtayı ayarla
        setBoard(moveData.board);
        
        // Skoru güncelle
        setScore(moveData.score);
        
        // Kalan harf sayısını güncelle
        setRemainingLetters(prev => prev - placedLetters.length);
        
        // Yerleştirilen harfleri temizle
        setPlacedLetters([]);
        
        // Eldeki harfleri yenile
        const yeniHarfler = generateRandomLetters(placedLetters.length);
        setPlayerHand(prev => [...prev, ...yeniHarfler]);
        
        // Onaylama butonunu kaldır
        setShowConfirm(false);
        
        // Başarılı mesajı göster
        Alert.alert("Başarılı", "Hamle başarıyla kaydedildi.");
      }
    } catch (error: any) {
      console.error("Hamle onaylanırken hata:", error);
      
      // Hata mesajını göster
      const errorMessage = error.response?.data?.message || "Hamleniz kaydedilemedi. Lütfen tekrar deneyin.";
      Alert.alert("Hata", errorMessage);
      
      // Eğer geçersiz kelime hatası dönerse yerleştirilen harfleri tahtadan kaldır
      if (errorMessage.includes("Geçersiz kelime")) {
        placedLetters.forEach(({ row, col }) => {
          const newBoard = [...board];
          newBoard[row][col] = '';
          setBoard(newBoard);
        });
        
        // Harfleri ele geri ekle
        const returnedLetters = placedLetters.map(({ letter }) => ({
          letter,
          point: letterPool[letter]?.point || 0
        }));
        
        setPlayerHand(prev => [...prev, ...returnedLetters]);
        setPlacedLetters([]);
        setShowConfirm(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!gameLoaded || isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

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
      else if (bonus === '★') kelimeKatsayi *= 2; // Orta kare
  
      kelime += letter;
    }
  
    if (kelimeGecerliMi(kelime)) {
      return toplamPuan * kelimeKatsayi;
    } else {
      return 0; // Geçersiz kelime
    }
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

  const renderBoard = () => {
    return (
      <ScrollView contentContainerStyle={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((tile, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.tile,
                  {
                    backgroundColor: getBonusType(rowIndex, colIndex) ? 'yellow' : 'white',
                    width: tileWidth,
                    height: tileHeight
                  }
                ]}
                onPress={() => handleTilePress(rowIndex, colIndex)}
              >
                <Text style={styles.tileText}>{tile}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Üst Bilgi Çubuğu */}
      <View style={styles.header}>
        <Text style={styles.score}>Puan: {score}</Text>
        <Text style={styles.remaining}>Kalan Harf: {remainingLetters}</Text>
      </View>

      {/* Oyun Tahtası */}
      <ScrollView style={styles.boardContainer}>
        <View style={styles.board}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const bonus = getBonusType(rowIndex, colIndex);
              const isPlaced = placedLetters.some(l => l.row === rowIndex && l.col === colIndex);
              
              return (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    bonus === 'H2' && styles.h2,
                    bonus === 'K2' && styles.k2,
                    bonus === 'H3' && styles.h3,
                    bonus === 'K3' && styles.k3,
                    bonus === '★' && styles.center,
                    isPlaced && styles.justPlaced
                  ]}
                  onPress={() => handleTilePress(rowIndex, colIndex)}
                >
                  {!cell && <Text style={styles.cellText}>{bonus}</Text>}
                  
                  {cell && (
                    <View style={[
                      styles.letterCard,
                      isPlaced && styles.justPlacedTile
                    ]}>
                      <Text style={styles.letterText}>{cell}</Text>
                      <Text style={styles.letterPoint}>
                        {letterPool[cell]?.point || 0}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Eldeki Harfler */}
      <View style={styles.hand}>
        {playerHand.map((tile, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tile,
              selectedLetterIndex === index && styles.selectedTile
            ]}
            onPress={() => handleLetterPress(index)}
          >
            <Text style={styles.letterText}>{tile.letter}</Text>
            <Text style={styles.letterPoint}>{tile.point}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Onaylama Butonu */}
      {showConfirm && (
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleMoveConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.confirmText}>✓ Hamleyi Onayla</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    paddingTop: 40 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4CAF50',
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginHorizontal: 20, 
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  score: { 
    fontSize: 18 * fontScale, 
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  remaining: { 
    fontSize: 18 * fontScale, 
    fontWeight: 'bold', 
    color: '#ff9800' 
  },
  boardContainer: { 
    flex: 1,
    marginVertical: 10,
  },
  board: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignSelf: 'center', 
    width: screenWidth,
    paddingBottom: 20,
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cellText: {
    fontSize: 10 * fontScale,
    fontWeight: '600',
    color: '#666',
  },
  row: {
    flexDirection: 'row',
  },
  tileText: {
    fontSize: 16 * fontScale,
    fontWeight: 'bold',
    color: '#333',
  },
  h2: { backgroundColor: '#bbdefb' }, // Light blue
  k2: { backgroundColor: '#f8bbd0' }, // Light pink
  h3: { backgroundColor: '#64b5f6' }, // Medium blue
  k3: { backgroundColor: '#f06292' }, // Medium pink
  center: { backgroundColor: '#ffd54f' }, // Amber
  justPlaced: {
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  hand: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexWrap: 'wrap', 
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderTopWidth: 1,
    borderTopColor: '#c8e6c9',
  },
  tile: {
    width: tileWidth,
    height: tileHeight,
    backgroundColor: '#ffd54f',
    margin: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  selectedTile: {
    backgroundColor: '#ff9800',
    borderWidth: 2,
    borderColor: '#f57c00',
  },
  letterCard: {
    backgroundColor: '#ffd54f',
    borderRadius: 4,
    width: cellSize - 4,
    height: cellSize - 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  justPlacedTile: {
    backgroundColor: '#aed581',
  },
  letterText: {
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
    color: '#333',
  },
  letterPoint: {
    fontSize: 10 * fontScale,
    fontWeight: '500',
    color: '#555',
    position: 'absolute',
    bottom: 2,
    right: 4,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12 * fontScale,
    paddingHorizontal: 24 * fontScale,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16 * fontScale,
  },
});