// script.js - Inicialização do jogo

import { initializeUI, toggleRecords, resetGame } from "./ui.js";
import { loadSavedGames } from "./storage.js"; // 🔹 Importa a função para carregar os jogos salvos
import "./game.js"; // Importa a lógica do jogo para garantir funcionamento

const playButton = document.getElementById("play-button");

//inicio de um teste
console.log("Verificando botão 'Play'...");

if (playButton) {
  console.log("Botão 'Play' encontrado!");
  playButton.addEventListener("click", () => {
    console.log("Botão 'Play' clicado!");
    document.getElementById("start-popup").style.display = "none";
    document.getElementById("game-settings").style.display = "flex";
  });
} else {
  console.error("Botão 'Play' NÃO encontrado no DOM!");
}
// fim do teste

const resetButton = document.getElementById("reset-button");
const toggleRecordsButton = document.getElementById("toggle-records");
const startButton = document.getElementById("start-game");

// 🔹 Evento para iniciar o jogo ao clicar no botão "Start Game"
startButton.addEventListener("click", () => {
  document.getElementById("game-settings").style.display = "none"; // Fecha o pop-up
});

// 🔹 Inicializa a interface ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  loadSavedGames(); // 🔹 Agora a tabela de jogos anteriores carrega automaticamente
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
