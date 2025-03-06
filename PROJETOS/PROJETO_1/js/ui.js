// ui.js - Manipulação da Interface do Usuário

import { getUserBalance, setUserBalance, resetGameData } from "./storage.js";

const totalBalanceDisplay = document.getElementById("total-balance");
const startPopup = document.getElementById("start-popup");
const settingsModal = document.getElementById("game-settings");
const gameContainer = document.querySelector(".game-container");
const newGameModal = document.getElementById("new-game-modal");
const recordsContainer = document.getElementById("records-container");
const historyBody = document.getElementById("history-body");
const gamesBody = document.getElementById("games-body");

// 🔹 Atualiza o saldo na tela
export function updateBalanceDisplay() {
  const balance = getUserBalance();
  totalBalanceDisplay.textContent = `€${balance.toFixed(2)}`;
}

// 🔹 Mostra um modal
export function showModal(modal) {
  modal.classList.remove("hidden");
  modal.style.display = "flex";
}

// 🔹 Esconde um modal
export function hideModal(modal) {
  modal.classList.add("hidden");
  modal.style.display = "none";
}

// 🔹 Alterna a visibilidade dos registros
export function toggleRecords() {
  recordsContainer.classList.toggle("hidden");
}

// 🔹 Reseta o jogo e atualiza a interface
export function resetGame() {
  resetGameData();
  updateBalanceDisplay();
  historyBody.innerHTML = "";
  gamesBody.innerHTML = "";
  showModal(startPopup);
}

// 🔹 Inicializa a interface
export function initializeUI() {
  updateBalanceDisplay();
  hideModal(settingsModal);
  hideModal(newGameModal);
  hideModal(gameContainer);
  hideModal(recordsContainer);
}
