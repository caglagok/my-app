//Game.tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { LetterTile, PlacedTile } from '../types/gameTypes';
import { letterPool } from '../constants/letterPool';
import { bonusTiles } from '../constants/bonusTiles';
import { getGame, surrenderGame, endGame} from '../services/gameServices';
import { submitMove, getMovesByGame } from '../services/moveServices';
import { JokerPopup } from '../components/JokerPopup';

const kelimeListesi: string[] = require('../assets/kelimeler.json');
const screenWidth = Dimensions.get('window').width;
const cellSize = Math.floor(screenWidth / 15); 
const tileWidth = Math.floor((screenWidth - 40) / 7); 
const tileHeight = Math.min(tileWidth * 1.25, 50); 
const fontScale = Math.min(screenWidth / 400, 1.2);

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
  const [isFirstMove, setIsFirstMove] = useState(true);
  const { duration, gameId: routeGameId } = useLocalSearchParams();
  const [opponentId, setOpponentId] = useState<string>('');
  const [opponentName, setOpponentName] = useState<string>('');
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>('');
  const [moves, setMoves] = useState<any[]>([]);
  const [isCurrentTurn, setIsCurrentTurn] = useState<boolean>(false);
  const [isJokerVisible, setIsJokerVisible] = useState(false);
  const [jokerLetter, setJokerLetter] = useState<string | null>(null);
  const [pendingJokerPlacement, setPendingJokerPlacement] = useState<{
    row: number; col: number; index: number;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const router = useRouter();

  const handleSelectJokerLetter = (letter: string) => {
    if (!pendingJokerPlacement) return;

    const { row, col, index } = pendingJokerPlacement;

    // Joker seçilen harf yerleştiriliyor ama puanı 0 oluyor
    const updatedLetters = [...placedLetters, { row, col, letter, point: 0, isJoker: true }];
    setPlacedLetters(updatedLetters);

    const newBoard = [...board];
    newBoard[row][col] = letter;
    setBoard(newBoard);

    const newHand = [...playerHand];
    newHand.splice(index, 1);
    setPlayerHand(newHand);
    
    setSelectedLetterIndex(null);
    setPendingJokerPlacement(null);
    setIsJokerVisible(false);
    if (updatedLetters.length > 0) {
      setShowConfirm(true);
    }
  };
  const generateRandomLetters = (count: number): LetterTile[] => {
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
  const getBonusType = (row: number, col: number): string => {
    if (bonusTiles.CENTER.some(tile => tile.row === row && tile.col === col)) return '★';
    if (bonusTiles.H3.some(tile => tile.row === row && tile.col === col)) return 'H3';
    if (bonusTiles.K3.some(tile => tile.row === row && tile.col === col)) return 'K3';
    if (bonusTiles.H2.some(tile => tile.row === row && tile.col === col)) return 'H2';
    if (bonusTiles.K2.some(tile => tile.row === row && tile.col === col)) return 'K2';
    return '';
  };

  const handleTilePress = (row: number, col: number) => {
    if (!isCurrentTurn) {
      Alert.alert("Uyarı", "Şu anda sıra sizde değil.");
      return;
    }
    const existingIndex = placedLetters.findIndex(l => l.row === row && l.col === col);
    if (board[row][col] !== '' && existingIndex === -1) {
      return;
    }
    if (existingIndex !== -1) {
      const removed = placedLetters[existingIndex];
      setPlacedLetters(prev => prev.filter((_, i) => i !== existingIndex));
      const newBoard = [...board];
      newBoard[row][col] = '';
      setBoard(newBoard);
      setPlayerHand(prev => [...prev, { 
        letter: removed.letter, 
        point: letterPool[removed.letter]?.point || 0 
      }]);
      if (placedLetters.length <= 1) {
        setShowConfirm(false);
      }
    } else if (selectedLetterIndex !== null && board[row][col] === '') {
      const letterTile = playerHand[selectedLetterIndex];
      const { letter, point } = letterTile;

      if (letter === 'JOKER') {
        setIsJokerVisible(true);
        setPendingJokerPlacement({ row, col, index: selectedLetterIndex });
        return;
      }

      if (isFirstMove) {
        const centerUsed = placedLetters.some(tile => tile.row === 7 && tile.col === 7) || (row === 7 && col === 7);
        if (!centerUsed) {
          Alert.alert("Uyarı", "İlk hamlede merkez kare (7,7) kullanılmalıdır.");
          return;
        }
      }

      const updatedLetters = [...placedLetters, { row, col, letter, point }];
      setPlacedLetters(updatedLetters);

      const newBoard = [...board];
      newBoard[row][col] = letter;
      setBoard(newBoard);

      const newHand = [...playerHand];
      newHand.splice(selectedLetterIndex, 1);
      setPlayerHand(newHand);

      setSelectedLetterIndex(null);
      if (updatedLetters.length > 0) {
        setShowConfirm(true);
      }
    }
  };

  const handleLetterPress = (index: number) => {
    if (!isCurrentTurn) {
      Alert.alert("Uyarı", "Şu anda sıra sizde değil.");
      return;
    }
    setSelectedLetterIndex(prevIndex => prevIndex === index ? null : index);
  };
/*
  const handleMoveConfirm = async () => {
    if (!isCurrentTurn) {
      Alert.alert("Uyarı", "Şu anda sıra sizde değil.");
      return;
    }
    
    if (placedLetters.length === 0) {
      Alert.alert("Uyarı", "Lütfen en az bir harf yerleştirin.");
      return;
    }
    setIsLoading(true);
    try {
      const formattedPlacedTiles = placedLetters.map(tile => ({
        x: tile.col,
        y: tile.row,
        letter: tile.letter,
        isJoker: tile.isJoker || false
      }));
      const moveData = await submitMove(
        gameId, 
        userId, 
        formattedPlacedTiles, 
        board,
        isFirstMove
      );
      const updatedGameData = await getGame(gameId);
      if (updatedGameData.currentTurn === userId) {
        setIsCurrentTurn(true);
      } else {
        setIsCurrentTurn(false);
      }

      if (moveData) {
        if (moveData.move && moveData.move.totalPoints) {
          setScore(prev => prev + moveData.move.totalPoints);
        }
        setIsFirstMove(false);
        
        setRemainingLetters(prev => {
          const newRemaining = prev - placedLetters.length;
      
          if (newRemaining <= 0) {
            const winner = (score + (moveData.move?.totalPoints || 0)) > opponentScore ? userId : opponentId;
            setGameOver(true);
            endGame(gameId, winner);
            Alert.alert(
              "Oyun Bitti",
              winner === userId
                ? "Tebrikler, oyunu kazandınız!"
                : "Maalesef rakibiniz kazandı.",
              [
                {
                  text: "Tamam",
                  onPress: () => router.replace("/HomePage")
                }
              ]
            );
          }         
          return newRemaining;
        });
        setPlacedLetters([]);
        const yeniHarfler = generateRandomLetters(placedLetters.length);
        setPlayerHand(prev => [...prev, ...yeniHarfler]);
        setShowConfirm(false);
        Alert.alert("Başarılı", `Hamle başarıyla kaydedildi. ${moveData.move.totalPoints} puan kazandınız.`);
        const updatedMoves = await getMovesByGame(gameId);
        setMoves(updatedMoves);
        const updatedGameData = await getGame(gameId);
        setIsCurrentTurn(updatedGameData.currentTurn === userId);
      }
      if (gameOver) return;
    } 
    catch (error: any) {
      console.error("Hamle onaylanırken hata:", error);
      const errorMessage = error.message || "Hamleniz kaydedilemedi. Lütfen tekrar deneyin.";
      Alert.alert("Hata", errorMessage);
      if (errorMessage.includes("Geçersiz kelime")) {
        const returnedLetters = placedLetters.map(({ letter }) => ({
          letter,
          point: letterPool[letter]?.point || 0
        }));
        
        setPlayerHand(prev => [...prev, ...returnedLetters]);
        const newBoard = [...board];
        placedLetters.forEach(({ row, col }) => {
          newBoard[row][col] = '';
        });
        setBoard(newBoard);
        
        setPlacedLetters([]);
        setShowConfirm(false);
      }
    } finally {
      setIsLoading(false);
    }
  }*/
    const handleMoveConfirm = async () => {
      if (!isCurrentTurn) {
        Alert.alert("Uyarı", "Şu anda sıra sizde değil.");
        return;
      }
    
      // Oyun süresi dolmuş mu kontrol et
      const currentGameData = await getGame(gameId);
    
      // Süreyi kontrol et ve oyun bitmişse durumu güncelle
      const now = new Date().getTime();
      const lastMoveTime = new Date(currentGameData.updatedAt).getTime();
      let limitMs = 0;
    
      // Oyun tipi bazlı zaman kontrolü
      switch (currentGameData.type) {
        case "2dk":
          limitMs = 2 * 60 * 1000;
          break;
        case "5dk":
          limitMs = 5 * 60 * 1000;
          break;
        case "12saat":
          limitMs = 12 * 60 * 60 * 1000;
          break;
        case "24saat":
          limitMs = 24 * 60 * 60 * 1000;
          break;
        default:
          break;
      }
    
      if (limitMs > 0 && now - lastMoveTime > limitMs) {
        // Süre dolmuş, rakip kazandı
        const opponent = currentGameData.players.find((p: string) => p !== userId);
        await endGame(gameId, opponent); // Rakip kazandı olarak oyunu bitir
        Alert.alert("Süre Doldu", "Hamle süreniz doldu. Rakibiniz oyunu kazandı.", [
          { text: "Tamam", onPress: () => router.replace("/HomePage") },
        ]);
        return;
      }
    
      // Eğer oyun aktif değilse (süre bitmişse)
      if (!currentGameData.isActive) {
        const winnerMessage =
          currentGameData.winner === userId
            ? "Tebrikler, oyunu kazandınız!"
            : "Maalesef rakibiniz kazandı.";
        Alert.alert("Oyun Bitti", winnerMessage);
        return;
      }
    
      if (placedLetters.length === 0) {
        Alert.alert("Uyarı", "Lütfen en az bir harf yerleştirin.");
        return;
      }
    
      setIsLoading(true);
      try {
        const updatedGameDataBeforeMove = await getGame(gameId);
    
        // 🕒 Oyun tipi bazlı zaman kontrolü
        const now = new Date().getTime();
        const lastMoveTime = new Date(updatedGameDataBeforeMove.updatedAt).getTime();
        let limitMs = 0;
    
        switch (updatedGameDataBeforeMove.type) {
          case "2dk":
            limitMs = 2 * 60 * 1000;
            break;
          case "5dk":
            limitMs = 5 * 60 * 1000;
            break;
          case "12saat":
            limitMs = 12 * 60 * 60 * 1000;
            break;
          case "24saat":
            limitMs = 24 * 60 * 60 * 1000;
            break;
          default:
            break;
        }
    
        if (limitMs > 0 && now - lastMoveTime > limitMs) {
          const opponent = updatedGameDataBeforeMove.players.find(
            (p: string) => p !== userId
          );
          await endGame(gameId, opponent); // Rakip kazandı olarak oyunu bitir
          Alert.alert("Süre Doldu", "Hamle süreniz doldu. Rakibiniz oyunu kazandı.", [
            { text: "Tamam", onPress: () => router.replace("/HomePage") },
          ]);
          return;
        }
    
        // Süre ve aktiflik kontrolünden geçildi, hamle işlemi başlatılabilir
        const formattedPlacedTiles = placedLetters.map((tile) => ({
          x: tile.col,
          y: tile.row,
          letter: tile.letter,
          isJoker: tile.isJoker || false,
        }));
    
        const moveData = await submitMove(
          gameId,
          userId,
          formattedPlacedTiles,
          board,
          isFirstMove
        );
    
        const updatedGameData = await getGame(gameId);
        if (updatedGameData.currentTurn === userId) {
          setIsCurrentTurn(true);
        } else {
          setIsCurrentTurn(false);
        }
    
        if (moveData) {
          if (moveData.move && moveData.move.totalPoints) {
            setScore((prev) => prev + moveData.move.totalPoints);
          }
          setIsFirstMove(false);
    
          setRemainingLetters((prev) => {
            const newRemaining = prev - placedLetters.length;
    
            if (newRemaining <= 0) {
              const winner =
                score + (moveData.move?.totalPoints || 0) > opponentScore
                  ? userId
                  : opponentId;
              setGameOver(true);
              endGame(gameId, winner);
              Alert.alert(
                "Oyun Bitti",
                winner === userId
                  ? "Tebrikler, oyunu kazandınız!"
                  : "Maalesef rakibiniz kazandı.",
                [
                  {
                    text: "Tamam",
                    onPress: () => router.replace("/HomePage"),
                  },
                ]
              );
            }
            return newRemaining;
          });
          setPlacedLetters([]);
          const yeniHarfler = generateRandomLetters(placedLetters.length);
          setPlayerHand((prev) => [...prev, ...yeniHarfler]);
          setShowConfirm(false);
          Alert.alert(
            "Başarılı",
            `Hamle başarıyla kaydedildi. ${moveData.move.totalPoints} puan kazandınız.`
          );
          const updatedMoves = await getMovesByGame(gameId);
          setMoves(updatedMoves);
          const updatedGameData = await getGame(gameId);
          setIsCurrentTurn(updatedGameData.currentTurn === userId);
        }
        if (gameOver) return;
      } catch (error: any) {
        console.error("Hamle onaylanırken hata:", error);
        const errorMessage = error.message || "Hamleniz kaydedilemedi. Lütfen tekrar deneyin.";
        Alert.alert("Hata", errorMessage);
        if (errorMessage.includes("Geçersiz kelime")) {
          const returnedLetters = placedLetters.map(({ letter }) => ({
            letter,
            point: letterPool[letter]?.point || 0,
          }));
    
          setPlayerHand((prev) => [...prev, ...returnedLetters]);
          const newBoard = [...board];
          placedLetters.forEach(({ row, col }) => {
            newBoard[row][col] = "";
          });
          setBoard(newBoard);
    
          setPlacedLetters([]);
          setShowConfirm(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
  const handlePass = async () => {
    if (!isCurrentTurn) {
      Alert.alert("Uyarı", "Şu anda sıra sizde değil.");
      return;
    }
  
    setIsLoading(true);
    try {
      await submitMove(gameId, userId, [], board, isFirstMove); // boş hamle
      const updatedGameData = await getGame(gameId);
      setIsCurrentTurn(updatedGameData.currentTurn === userId);
      setIsFirstMove(false);
      setShowConfirm(false);
      Alert.alert("Pas Geçildi", "Sıranız başarıyla pas geçildi.");
      const updatedMoves = await getMovesByGame(gameId);
      setMoves(updatedMoves);
    } catch (error: any) {
      console.error("Pas geçilirken hata:", error);
      Alert.alert("Hata", "Pas geçilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }; 
  const handleSurrender = async () => {
    try {
      const response = await surrenderGame(gameId, userId);
  
      setGameOver(true); 
  
      if (response?.winner) {
        Alert.alert("Oyun Bitti", `Oyunu teslim ettiniz. Kazanan: ${response.winner}`, [
          {
            text: "Tamam",
            onPress: () => router.replace("/ResultPage") 
          }
        ]);
      } else {
        Alert.alert("Oyun Bitti", "Oyunu teslim ettiniz, ancak rakip yok.", [
          {
            text: "Tamam",
            onPress: () => router.replace("/ResultPage")
          }
        ]);
      }
      const gameData = await getGame(gameId);
      router.push({
        pathname: '/ResultPage',
        params: {
          score: score.toString(),
          opponentScore: opponentScore.toString(),
          remainingLetters: playerHand.length.toString(),
          winner: gameData.winner 
        }
      });
    } catch (error) {
      console.log('Teslim olurken gönderilen userId:', userId);
      console.error('Teslim olma hatası:', error);
      Alert.alert("Hata", "Teslim olma işlemi başarısız oldu.");
    }
  };  
  const kelimeGecerliMi = (kelime: string): boolean => {
    if (!Array.isArray(kelimeListesi)) {
      console.error('Kelime listesi uygun formatta değil.');
      return false;
    }
    return kelimeListesi.includes(kelime.toLowerCase());
  };
  const kelimePuaniHesapla = (): number => {
    let kelime = '';
    let toplamPuan = 0;
    let kelimeKatsayi = 1;
  
    for (const tile of placedLetters) {
      const letter = tile.letter;
      const puan = tile.isJoker ? 0 : (letterPool[letter]?.point || 0);
      const bonus = getBonusType(tile.row, tile.col);
  
      if (bonus === 'H2') toplamPuan += puan * 2;
      else if (bonus === 'H3') toplamPuan += puan * 3;
      else toplamPuan += puan;
  
      if (bonus === 'K2') kelimeKatsayi *= 2;
      else if (bonus === 'K3') kelimeKatsayi *= 3;
      else if (bonus === '★') kelimeKatsayi *= 2; 
  
      kelime += letter;
    }
    if (kelimeGecerliMi(kelime)) {
      return toplamPuan * kelimeKatsayi;
    } else {
      return 0; 
    }
  };
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
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUsername = await AsyncStorage.getItem('username');
  
        if (!storedUserId) {
          Alert.alert("Hata", "Kullanıcı ID bulunamadı. Lütfen tekrar giriş yapın.");
          return;
        }
  
        setUserId(storedUserId);
        setPlayerName(storedUsername || "Oyuncu");
  
        if (routeGameId) {
          const gameData = await getGame(routeGameId as string);
          const movesData = await getMovesByGame(routeGameId as string);
  
          setGameId(routeGameId as string);
  
          // 1. Tahta durumunu oluştur
          const boardState = Array(15).fill(null).map(() => Array(15).fill(''));
          if (movesData && movesData.length > 0) {
            setMoves(movesData);
            setIsFirstMove(false);
            movesData.forEach((move: any) => {
              move.placed.forEach((tile: any) => {
                boardState[tile.y][tile.x] = tile.letter;
              });
            });
          }
          setBoard(boardState);
  
          // 2. Sıra kimde kontrolü
          if (gameData.currentTurn) {
            const currentTurnId = typeof gameData.currentTurn === 'string'
              ? gameData.currentTurn
              : gameData.currentTurn._id;
            setIsCurrentTurn(currentTurnId === storedUserId);
          }
  
          // 3. Skor bilgisi
          if (gameData.scores?.length > 0) {
            const currentPlayerScore = gameData.scores.find(
              (s: any) => s.player === storedUserId || s.player._id === storedUserId
            );
            if (currentPlayerScore) {
              setScore(currentPlayerScore.score || 0);
            }
          }
  
          // 4. Rakip bilgisi ve skoru
          if (gameData.players?.length > 1) {
            const opponent = gameData.players.find((p: any) =>
              (p._id || p) !== storedUserId
            );
  
            const opponentId = opponent?._id || opponent;
            const opponentName = opponent?.username || "Rakip";
  
            setOpponentId(opponentId);
            setOpponentName(opponentName);
  
            const opponentScoreObj = gameData.scores.find(
              (s: any) => s.player === opponentId || s.player._id === opponentId
            );
            if (opponentScoreObj) {
              setOpponentScore(opponentScoreObj.score || 0);
            }
          }
  
          // 5. Kalan harf sayısı
          const totalLetters = Object.values(letterPool).reduce((acc, { count }) => acc + count, 0);
          const usedLetters = movesData
            ? movesData.reduce((acc: number, move: any) => acc + move.placed.length, 0)
            : 0;
          setRemainingLetters(totalLetters - usedLetters - 7); // 7 eldeki harf
  
          // 6. El boşsa yeni harf üret
          if (playerHand.length === 0) {
            setPlayerHand(generateRandomLetters(7));
          }
  
          setGameLoaded(true);
        }
      } catch (error) {
        console.error("Oyun verisi yüklenirken hata:", error);
        Alert.alert("Hata", "Oyun verisi alınamadı. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [routeGameId]);

  if (!gameLoaded || isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}> 
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Oyun Alanı */}
        <View style={styles.boardArea}>
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
        </View>
  
        {/* Orta Bilgi Çubuğu */}
        <View style={styles.header}>
          {/* Sol - Kullanıcı bilgisi */}
          <View
            style={[
              styles.playerInfo,
              isCurrentTurn && styles.currentTurnPlayer // sırada olan kullanıcı kırmızı olacak
            ]}
          >
            <Text style={styles.playerName}>{playerName}</Text>
            <Text style={styles.score}>{score}</Text>
          </View>
  
          {/* Orta - Kalan harf */}
          <View style={styles.centerInfo}>
            <Text style={styles.remainingLabel}>Kalan</Text>
            <Text style={styles.remainingCount}>{remainingLetters}</Text>
          </View>
  
          {/* Sağ - Rakip bilgisi */}
          <View
            style={[
              styles.playerInfo,
              !isCurrentTurn && styles.currentTurnPlayer // sıra rakipteyse onun arka planı kırmızı olacak
            ]}
          >
            <Text style={styles.score}>{opponentScore}</Text>
            <Text style={styles.opponentName}>{opponentName}</Text>
          </View>
        </View>
  
        {/* Alt Kısım - Harfler ve Onay */}
        <View style={styles.bottomArea}>
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

          <View style={styles.confirmContainer}>
            {/* Onaylama Butonu */}
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                !showConfirm && styles.disabledButton
              ]} 
              onPress={handleMoveConfirm}
              disabled={!showConfirm || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.confirmText}>
                  {showConfirm ? "✓ Hamleyi Onayla" : "Harf Yerleştirin"}
                </Text>
              )}
            </TouchableOpacity>
            {/* PASS Butonu */}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: '#999', marginTop: 10 }]}
              onPress={handlePass}
              disabled={!isCurrentTurn || isLoading}
            >
              <Text style={styles.confirmText}>✕ Pas Geç</Text>
            </TouchableOpacity>
            {/* Teslim Ol Butonu */}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: '#f00', marginTop: 10 }]} // Kırmızı renk
              onPress={handleSurrender}
              disabled={isLoading} // Teslim olma sırasında butonun devre dışı kalmasını sağlıyoruz
            >
              <Text style={styles.confirmText}>✕ Teslim Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Joker Harfi Seç Pop-up */}
        <JokerPopup
          isVisible={isJokerVisible}
          onClose={() => setIsJokerVisible(false)}
          onSelectLetter={handleSelectJokerLetter}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  boardArea: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  }, 
  turnIndicator: {
    marginTop: 4,
    fontSize: 12 * fontScale,
    fontStyle: 'italic',
    color: '#4CAF50',
  }, 
  bottomArea: {
    flex: 3, 
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#cccccc',
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#e8f5e9',
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  playerName: {
    fontSize: 14 * fontScale,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginRight: 6,
  },
  opponentName: {
    fontSize: 14 * fontScale,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginLeft: 6,
  },
  score: { 
    fontSize: 16 * fontScale, 
    fontWeight: 'bold',
    color: '#333333',
  },
  centerInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 12,
    paddingVertical: 2,
  },
  remainingLabel: {
    fontSize: 10 * fontScale,
    fontWeight: '400',
    color: '#666',
  },
  remainingCount: { 
    fontSize: 16 * fontScale, 
    fontWeight: 'bold', 
    color: '#ff9800' 
  },
  remaining: { 
    fontSize: 18 * fontScale, 
    fontWeight: 'bold', 
    color: '#ff9800' 
  },
  gameArea: {
    flex: 1,
    flexDirection: 'column',
  },
  hand: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexWrap: 'wrap', 
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
    zIndex: 10, 
  },
  confirmContainer: {
    padding: 6,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 5,
  },
  boardContainer: { 
    backgroundColor: '#f0f0f0',
  },
  boardContent: {
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 50 : 20, 
  },
  board: {
    width: cellSize * 15,
    height: cellSize * 15,
    flexDirection: 'row', 
    flexWrap: 'wrap', 
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
  h2: { backgroundColor: '#bbdefb' }, 
  k2: { backgroundColor: '#f8bbd0' }, 
  h3: { backgroundColor: '#64b5f6' }, 
  k3: { backgroundColor: '#f06292' }, 
  center: { backgroundColor: '#ffd54f' },
  justPlaced: {
    borderWidth: 2,
    borderColor: '#4caf50',
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
    transform: [
      { translateY: -3 }, 
      { scale: 0.8 }     
    ],
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
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
  disabledButton: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0.1,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16 * fontScale,
  },
  currentTurnPlayer: {
    backgroundColor: '#FFCDD2', // açık kırmızı
    borderRadius: 10,
    padding: 5,
  }  
});