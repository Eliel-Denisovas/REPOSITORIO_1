// script.js - Inicialização do jogo

import { initializeUI, toggleRecords, resetGame } from "./ui.js";
import { loadSavedGames } from "./storage.js"; // 🔹 Importa a função para carregar os jogos salvos
import "./game.js"; // Importa a lógica do jogo para garantir funcionamento

const playButton = document.getElementById("play-button");

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

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const gameBoard = document.querySelector('.game-board');
  const balanceAndBoard = document.querySelector('.balance-and-board');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Desativar cliques
      balanceAndBoard.classList.add('no-click');

      // Girar a carta
      card.classList.add('flipped');

      // Adicionar cor de feedback (simulação de acerto ou erro)
      const isCorrect = Math.random() > 0.5; // Simulação de acerto ou erro
      gameBoard.classList.add(isCorrect ? 'correct' : 'incorrect');

      // Aguardar a animação de girar a carta
      setTimeout(() => {
        // Reverter a animação de girar a carta
        card.classList.remove('flipped');

        // Aguardar a animação de reverter a carta
        setTimeout(() => {
          // Remover cor de feedback
          gameBoard.classList.remove('correct', 'incorrect');

          // Adicionar cor de transição azul
          gameBoard.classList.add('transition-blue');

          // Aguardar a animação de transição azul
          setTimeout(() => {
            // Remover cor de transição azul
            gameBoard.classList.remove('transition-blue');

            // Reativar cliques
            balanceAndBoard.classList.remove('no-click');
          }, 600); // Tempo da animação de transição azul
        }, 600); // Tempo da animação de reverter a carta
      }, 600); // Tempo da animação de girar a carta
    });
  });
});