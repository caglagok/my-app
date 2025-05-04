# 📱 Word Mines

**Mobile Game Development Project**

## 📝 Project Summary

Word Mines is a dynamic, real-time, two-player mobile word game. Developed using React Native and Node.js in a client-server architecture, the game provides a fun platform where users are matched randomly to form words from letters, with added mechanics like mines and bonuses.

### 🔑 Keywords
Mobil development · Dynamic gameplay · Client-server · React Native · Node.js · TypeScript · WebSocket · MongoDB Atlas · Expo Go

---

## 📲 Technologies

### 🎨 Frontend - React Native (Expo)

- **React Native** – Mobile app components (View, Text, StyleSheet)
- **Expo** – Fast development and testing
- **expo-router** – Page routing system
- **expo-linear-gradient** – Background transition effects
- **@react-native-async-storage/async-storage** – Local data storage
- **Moti / react-native-reanimated** – Animations
- **react-native-safe-area-context** – Safe area support
- **axios** – API requests
- **TypeScript** – Type safety and readable code
- **FlatList, ScrollView, Alert, ActivityIndicator, Pressable, Dimensions** – UI components

### 🖥️ Backend - Node.js + Express

- **Express.js** – Building RESTful APIs
- **Mongoose** – MongoDB data modeling
- **Dotenv** – Environment variables
- **Cors** – Cross-Origin request support
- **Socket.IO** – Real-time multiplayer game infrastructure

### ☁️ Development Environment

- **MongoDB Atlas** – Cloud database
- **Render** – Backend server hosting
- **Expo Go** – Mobile app testing tool

---

## 🎮Game Mechanics

- Users sign up and log in to access the game.
- Players are matched randomly to start a game.
- Each player is given 7 letters.
- Each player has 2 pass rights; using both results in a loss.
- A player who surrenders is considered defeated.
- The game has a limited pool of 100 letters.
- Mines and bonuses are placed at random coordinates.
- Scores are calculated based on moves; the player with the highest score wins.

---

## 📦 Setup

### 1. Frontend 
```bash
npm install
npx expo start
```
### 2. Backend
```bash
npm install
npm run dev
```

Backend Project Link:

--------------------------------------------------------------------------------------------

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
