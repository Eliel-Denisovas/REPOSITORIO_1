document.addEventListener("DOMContentLoaded", () => {
  // 🎮 Seleção de elementos do jogo
  const playButton = document.getElementById("play-button");
  const startButton = document.getElementById("start-game");
  const restartButton = document.getElementById("restart-game");
  const toggleRecords = document.getElementById("toggle-records");
  const recordsContainer = document.getElementById("records-container");
  const historyBody = document.getElementById("history-body");
  const gamesBody = document.getElementById("games-body");
  const totalBalanceDisplay = document.getElementById("total-balance");
  const finalWinningsDisplay = document.getElementById("final-winnings");
  const startPopup = document.getElementById("start-popup");
  const settingsModal = document.getElementById("game-settings");
  const gameContainer = document.querySelector(".game-container");
  const newGameModal = document.getElementById("new-game-modal");
  const cardLeft = document.getElementById("card-left");
  const cardRight = document.getElementById("card-right");

  // 💰 Variáveis do jogo
  let userBalance = 1000.00;
  let betAmount = 10.00;
  let totalRounds = 5;
  let currentRound = 0;
  let gameResult = 0;
  let initialBet = 10.00;
  let roundBet = 0;

  function initializeGame() {
    startPopup.style.display = "flex";
    settingsModal.style.display = "none";
    newGameModal.style.display = "none";
    gameContainer.style.display = "none";
    recordsContainer.classList.add("hidden");
  }
  initializeGame();

  playButton.addEventListener("click", () => {
    startPopup.style.display = "none";
    settingsModal.style.display = "flex";
  });

  toggleRecords.addEventListener("click", () => {
    recordsContainer.classList.toggle("hidden");
  });

  startButton.addEventListener("click", () => {
    betAmount = parseFloat(document.getElementById("bet").value);
    totalRounds = parseInt(document.getElementById("rounds").value);
    gameResult = betAmount;
    initialBet = betAmount;
    roundBet = betAmount / totalRounds; // Aposta dividida pelo número de rodadas
    currentRound = 0;
    
    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;
    historyBody.innerHTML = `
      <tr>
        <td>0</td>
        <td class="neutral">Initial</td>
        <td class="neutral">€${initialBet.toFixed(2)}</td>
        <td>€${gameResult.toFixed(2)}</td>
      </tr>
    `;

    settingsModal.style.display = "none";
    gameContainer.style.display = "block";

    nextRound();
  });

  function nextRound() {
    if (currentRound >= totalRounds) {
      endGame();
      return;
    }

    currentRound++;

    cardLeft.style.backgroundImage = "url('assets/images/fundo.webp')";
    cardRight.style.backgroundImage = "url('assets/images/fundo.webp')";

    cardLeft.addEventListener("click", chooseCard);
    cardRight.addEventListener("click", chooseCard);
  }

  function chooseCard(event) {
    cardLeft.removeEventListener("click", chooseCard);
    cardRight.removeEventListener("click", chooseCard);

    const isKingLeft = Math.random() > 0.5;
    const won = event.target === (isKingLeft ? cardLeft : cardRight);
    let roundAmount = won ? roundBet : -roundBet;
    gameResult += roundAmount;

    cardLeft.style.backgroundImage = isKingLeft
      ? "url('assets/images/rei.webp')"
      : "url('assets/images/rainha.webp')";
    cardRight.style.backgroundImage = isKingLeft
      ? "url('assets/images/rainha.webp')"
      : "url('assets/images/rei.webp')";

    let resultClass = won ? "win" : "loss";
    let resultText = won ? "🏆 Win" : "❌ Loss";
    let formattedAmount = (roundAmount > 0 ? "+" : "") + roundAmount.toFixed(2);

    historyBody.innerHTML = `
      <tr>
        <td>${currentRound}</td>
        <td class="${resultClass}">${resultText}</td>
        <td class="${resultClass}">${formattedAmount} €</td>
        <td>€${gameResult.toFixed(2)}</td>
      </tr>
    ` + historyBody.innerHTML;

    setTimeout(() => {
      if (currentRound < totalRounds) {
        nextRound();
      } else {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    gameResult -= betAmount;
    userBalance += gameResult;
    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;

    gamesBody.insertAdjacentHTML("afterbegin", `
        <tr>
            <td>Game ${gamesBody.children.length + 1}</td>
            <td>${totalRounds}</td>
            <td>€${initialBet.toFixed(2)}</td>
            <td class="${gameResult < 0 ? 'loss' : 'win'}">€${gameResult.toFixed(2)}</td>
            <td>€${userBalance.toFixed(2)}</td> <!-- Nova Coluna -->
        </tr>
    `);

    finalWinningsDisplay.textContent = `€${gameResult.toFixed(2)}`;
    finalWinningsDisplay.classList.toggle("loss", gameResult < 0);

    newGameModal.style.display = "flex";
}
  restartButton.addEventListener("click", () => {
    newGameModal.style.display = "none";
    settingsModal.style.display = "flex";
  });
});