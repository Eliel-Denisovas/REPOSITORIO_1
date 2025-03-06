// script.js - Inicialização do jogo

import { initializeUI, toggleRecords, resetGame } from "./ui.js";
import "./game.js"; // Importa a lógica do jogo para garantir funcionamento

const playButton = document.getElementById("play-button");
const resetButton = document.getElementById("reset-button");
const toggleRecordsButton = document.getElementById("toggle-records");

// 🔹 Inicializa a interface ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
});

// 🔹 Evento para iniciar o jogo
playButton.addEventListener("click", () => {
  document.getElementById("start-popup").style.display = "none";
  document.getElementById("game-settings").style.display = "flex";
});

// 🔹 Evento para alternar exibição dos registros
toggleRecordsButton.addEventListener("click", toggleRecords);

// 🔹 Evento para resetar o jogo
resetButton.addEventListener("click", resetGame);

