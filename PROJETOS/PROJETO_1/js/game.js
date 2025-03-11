// game.js - Lógica principal do jogo

import { getUserBalance, setUserBalance, saveGameResult } from "./storage.js";
import { updateBalanceDisplay, showModal, hideModal, addGameToTable } from "./ui.js";

const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart-game");
const exitButton = document.getElementById("exit-game");
const historyBody = document.getElementById("history-body");
const newGameModal = document.getElementById("new-game-modal");
const cardLeft = document.getElementById("card-left");
const cardRight = document.getElementById("card-right");

let userBalance = getUserBalance();
let betAmount = 10;
let totalRounds = 5;
let currentRound = 0;
let gameResult = 0;

// 🔹 Inicia o jogo
function startGame() {
    document.getElementById("history-body").innerHTML = ""; // 🔹 Limpa a tabela do jogo atual antes de começar

    betAmount = parseFloat(document.getElementById("bet").value);
    totalRounds = parseInt(document.getElementById("rounds").value);

    if (isNaN(betAmount) || betAmount <= 0 || isNaN(totalRounds) || totalRounds <= 0) {
        alert("Por favor, insira valores válidos para aposta e número de rodadas.");
        return;
    }

    gameResult = 0;
    currentRound = 0;

    hideModal(document.getElementById("game-settings")); // Fecha o pop-up

    document.querySelector(".game-container").classList.remove("hidden");
    document.querySelector(".game-container").style.display = "block"; 

    document.getElementById("records-container").classList.remove("hidden");
    document.getElementById("records-container").style.display = "block"; 

    nextRound();
}

// 🔹 Próxima rodada do jogo
function nextRound() {
    if (currentRound >= totalRounds) {
        endGame();
        return;
    }

    currentRound++;
    console.log(`Rodada ${currentRound} de ${totalRounds}`);

    // Define aleatoriamente o lado do rei
    const isKingLeft = Math.random() > 0.5;

    // Atualiza as cartas (ocultando imagens anteriores)
    cardLeft.style.backgroundImage = "url('assets/images/fundo.webp')";
    cardRight.style.backgroundImage = "url('assets/images/fundo.webp')";

    // Espera o jogador clicar em uma carta
    cardLeft.onclick = () => chooseCard(true, isKingLeft);
    cardRight.onclick = () => chooseCard(false, isKingLeft);
}

// 🔹 Função para processar a escolha do jogador
function chooseCard(choseLeft, isKingLeft) {
    const won = choseLeft === isKingLeft;
    const roundAmount = won ? betAmount / totalRounds : -betAmount / totalRounds;

    gameResult += roundAmount;
    userBalance += roundAmount;
    setUserBalance(userBalance);
    updateBalanceDisplay();

    // Atualiza a imagem das cartas após a escolha
    cardLeft.style.backgroundImage = isKingLeft
        ? "url('assets/images/rei.webp')"
        : "url('assets/images/rainha.webp')";
    cardRight.style.backgroundImage = isKingLeft
        ? "url('assets/images/rainha.webp')"
        : "url('assets/images/rei.webp')";

    // Obtém a data e hora do evento
    const currentDateTime = new Date().toLocaleString();
    const kingSide = isKingLeft ? "Left" : "Right";

    // Adiciona resultado à tabela de histórico
    historyBody.insertAdjacentHTML(
        "afterbegin",
        `<tr>
            <td>${currentRound}</td>
            <td class="${won ? "win" : "loss"}">${won ? "🏆 Win" : "❌ Loss"}</td>
            <td>${roundAmount.toFixed(2)} €</td>
            <td>€${gameResult.toFixed(2)}</td>
            <td>${kingSide}</td>
            <td>${currentDateTime}</td>
        </tr>`
    );

    // Remove os eventos de clique para evitar múltiplos cliques na mesma rodada
    cardLeft.onclick = null;
    cardRight.onclick = null;

    // Passa para a próxima rodada após um pequeno delay
    setTimeout(() => {
        if (currentRound < totalRounds) {
            nextRound();
        } else {
            endGame();
        }
    }, 1000);
}

// 🔹 Finaliza o jogo e salva o resultado
function endGame() {
    const gamesBody = document.getElementById("games-body");

    if (!gamesBody) {
        console.error("Elemento 'games-body' não encontrado.");
        return;
    }

    // 🔹 Captura todas as rodadas do "Current Game"
    const roundsData = [...document.querySelectorAll("#history-body tr")].map(row => {
        const cells = row.querySelectorAll("td");
        return {
            round: cells[0]?.textContent || "0",
            result: cells[1]?.textContent.includes("Win") ? "Win" : "Loss",
            amount: cells[2]?.textContent.replace("€", "").trim() || "0.00",
            gameTotal: cells[3]?.textContent.replace("€", "").trim() || "0.00",
            kingSide: cells[4]?.textContent || "Unknown",
            dateTime: cells[5]?.textContent || "Unknown"
        };
    });

    const gameData = {
        gameIndex: gamesBody.children.length + 1,
        roundsPlayed: totalRounds,
        initialBet: betAmount.toFixed(2),
        result: gameResult.toFixed(2),
        totalBalance: userBalance.toFixed(2),
        rounds: roundsData // 🔹 Armazena detalhes das rodadas
    };

    saveGameResult(gameData);
    addGameToTable(gameData);

    // 🔹 Limpa a tabela "Current Game" para evitar duplicação visual
    document.getElementById("history-body").innerHTML = "";

    // 🔹 Exibe os ganhos corretamente no pop-up
    const finalWinningsDisplay = document.getElementById("final-winnings");
    finalWinningsDisplay.textContent = `€${gameResult.toFixed(2)}`;

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
