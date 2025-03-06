// storage.js - Gerenciamento de localStorage

const STORAGE_KEYS = {
    BALANCE: "userBalance",
    GAMES: "savedGames"
  };
  
  // 🔹 Recupera o saldo do usuário ou define o padrão de €1000,00
  export function getUserBalance() {
    const storedBalance = parseFloat(localStorage.getItem(STORAGE_KEYS.BALANCE));
    return isNaN(storedBalance) || storedBalance < 0 ? 1000.0 : storedBalance;
  }
  
  // 🔹 Atualiza e salva o saldo do usuário
  export function setUserBalance(balance) {
    localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toFixed(2));
  }
  
  // 🔹 Recupera os jogos salvos no localStorage
  export function getSavedGames() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMES)) || [];
  }
  
  // 🔹 Salva um novo jogo no histórico
  export function saveGameResult(gameData) {
    const savedGames = getSavedGames();
    savedGames.unshift(gameData); // Adiciona o novo jogo no início do array
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(savedGames));
  }
  
  // 🔹 Reseta o jogo (limpa saldo e histórico)
  export function resetGameData() {
    localStorage.removeItem(STORAGE_KEYS.BALANCE);
    localStorage.removeItem(STORAGE_KEYS.GAMES);
  }
  