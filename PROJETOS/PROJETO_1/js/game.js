// game.js - Lógica principal do jogo

import { getUserBalance, setUserBalance, saveGameResult } from "./storage.js";
import { updateBalanceDisplay, showModal, hideModal } from "./ui.js";

const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart-game");
const exitButton = document.getElementById("exit-game");
const historyBody = document.getElementById("history-body");
const newGameModal = document.getElementById("new-game-modal");

let userBalance = getUserBalance();
let betAmount = 10;
let totalRounds = 5;
let currentRound = 0;
let gameResult = 0;

// 🔹 Inicia o jogo
function startGame() {
  betAmount = parseFloat(document.getElementById("bet").value);
  totalRounds = parseInt(document.getElementById("rounds").value);
  gameResult = 0;
  currentRound = 0;

  nextRound();
}

// 🔹 Próxima rodada do jogo
function nextRound() {
  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  currentRound++;
  const isKingLeft = Math.random() > 0.5;
  const won = Math.random() > 0.5;
  const roundAmount = won ? betAmount / totalRounds : -betAmount / totalRounds;

  gameResult += roundAmount;
  userBalance += roundAmount;
  setUserBalance(userBalance);
  updateBalanceDisplay();

  historyBody.insertAdjacentHTML(
    "afterbegin",
    `<tr>
      <td>${currentRound}</td>
      <td class="${won ? "win" : "loss"}">${won ? "🏆 Win" : "❌ Loss"}</td>
      <td>${roundAmount.toFixed(2)} €</td>
      <td>€${gameResult.toFixed(2)}</td>
    </tr>`
  );

  if (currentRound < totalRounds) {
    setTimeout(nextRound, 1000);
  } else {
    endGame();
  }
}

// 🔹 Finaliza o jogo e salva o resultado
function endGame() {
  saveGameResult({
    roundsPlayed: totalRounds,
    initialBet: betAmount,
    result: gameResult.toFixed(2),
    totalBalance: userBalance.toFixed(2),
  });

  showModal(newGameModal);
}

// 🔹 Configura os eventos dos botões
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  hideModal(newGameModal);
  startGame();
});
exitButton.addEventListener("click", () => {
  hideModal(newGameModal);
});
