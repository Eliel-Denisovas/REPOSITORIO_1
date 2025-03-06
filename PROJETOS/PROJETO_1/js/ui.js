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

// 🔹 Adiciona um jogo à tabela de registros
export function addGameToTable(gameData) {
    const gamesBody = document.getElementById("games-body");

    if (!gamesBody) {
        console.error("Elemento 'games-body' não encontrado.");
        return;
    }

    // 🔹 Insere o novo jogo **no topo** da tabela usando "afterbegin" ao invés de "beforeend"
    gamesBody.insertAdjacentHTML("afterbegin", `
        <tr>
            <td>Game ${gameData.gameIndex}</td>
            <td>${gameData.roundsPlayed}</td>
            <td>€${gameData.initialBet}</td>
            <td class="${gameData.result < 0 ? 'loss' : 'win'}">€${gameData.result}</td>
            <td>€${gameData.totalBalance}</td>
            <td><button class="details-button" data-game-index="${gameData.gameIndex}">Details</button></td>
        </tr>
    `);

    // Adiciona evento ao botão "Details"
    document.querySelectorAll(".details-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const gameIndex = event.target.dataset.gameIndex;
            showGameDetails(gameIndex);
        });
    });
}

export function showGameDetails(gameIndex) {
    const savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    const gameData = savedGames.find(game => game.gameIndex == gameIndex);

    if (!gameData) {
        alert("Erro: Jogo não encontrado.");
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "dynamic-game-details-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Game ${gameIndex} Details</h2>
            <p><strong>Initial Bet:</strong> €${gameData.initialBet}</p>
            <p><strong>Rounds Played:</strong> ${gameData.roundsPlayed}</p>
            <p><strong>Final Result:</strong> €${gameData.result}</p>
            <p><strong>Final Balance:</strong> €${gameData.totalBalance}</p>

            <div class="scrollable-content" style="max-height: 300px; overflow-y: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Round</th>
                            <th>Result</th>
                            <th>Amount (€)</th>
                            <th>Game Total (€)</th>
                            <th>King Side</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gameData.rounds.map(round => `
                            <tr>
                                <td>${round.round}</td>
                                <td class="${round.result === 'Win' ? 'win' : 'loss'}">${round.result}</td>
                                <td>${round.amount} €</td>
                                <td>€${round.gameTotal}</td>
                                <td>${round.kingSide}</td>
                                <td>${round.dateTime}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <button class="close-game-details">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Evento para fechar o modal
    modal.querySelector(".close-game-details").addEventListener("click", () => {
        modal.remove();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}
    
// 🔹 Inicializa a interface
export function initializeUI() {
  updateBalanceDisplay();
  hideModal(settingsModal);
  hideModal(newGameModal);
  hideModal(gameContainer);
  hideModal(recordsContainer);
}

