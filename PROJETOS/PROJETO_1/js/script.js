document.addEventListener("DOMContentLoaded", () => {
  // 🎮 Seleção de elementos do jogo
  const playButton = document.getElementById("play-button");
  const startButton = document.getElementById("start-game");
  const restartButton = document.getElementById("restart-game");
  const resetButton = document.getElementById("reset-button");
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
  const exitButton = document.getElementById("exit-game");
  const toggleRecordsButton = document.getElementById("toggle-records");

  let initialGameBalance = 0;

  // 💰 Variáveis do jogo
  function getLastBalance() {
    const lastGameRow = gamesBody.querySelector("tr:first-child td:nth-child(5)");
    
    if (!lastGameRow || !lastGameRow.textContent) {
      return 1000.00; // Retorna o saldo inicial padrão se não houver jogos salvos
    }
    
    return parseFloat(lastGameRow.textContent.replace("€", "")) || 1000.00;
  }  
  
  // Inicializa com o último saldo registrado
  let userBalance = getLastBalance();
  
  let betAmount = 10.00;
  let totalRounds = 5;
  let currentRound = 0;
  let gameResult = 0;
  let initialBet = 10.00;
  let roundBet = 0;

  function initializeGame() {
    userBalance = getLastBalance(); // Atualiza saldo ao iniciar o jogo
    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;
    startPopup.style.display = "flex";
    settingsModal.style.display = "none";
    newGameModal.style.display = "none";
    gameContainer.style.display = "none";
    recordsContainer.classList.add("hidden");
}

  initializeGame();

  resetButton.addEventListener("click", () => {
    localStorage.clear(); // Apaga TODOS os dados salvos
    userBalance = 1000.00;
    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;
    historyBody.innerHTML = "";
    gamesBody.innerHTML = "";
    initializeGame(); // Reinicia o jogo como se fosse a primeira vez
});

  playButton.addEventListener("click", () => {
    startPopup.style.display = "none";
    settingsModal.style.display = "flex";
  });

  toggleRecordsButton.addEventListener("click", () => {
    recordsContainer.classList.toggle("hidden");
  });

  startButton.addEventListener("click", () => {
    initialGameBalance = userBalance.toFixed(2);

    userBalance = parseFloat(localStorage.getItem("userBalance")) || 1000.00;
    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;

    betAmount = parseFloat(document.getElementById("bet").value);
    totalRounds = parseInt(document.getElementById("rounds").value);
    gameResult = betAmount;
    initialBet = betAmount;
    roundBet = betAmount / totalRounds;
    currentRound = 0;

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

  restartButton.addEventListener("click", () => {
    newGameModal.style.display = "none";
    settingsModal.style.display = "flex";

    userBalance = parseFloat(localStorage.getItem("userBalance")) || 1000.00;
    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;

    betAmount = 10.00;
    totalRounds = 5;
    currentRound = 0;
    gameResult = 0;
    initialBet = 10.00;
    roundBet = 0;

    historyBody.innerHTML = "";
  });

  exitButton.addEventListener("click", () => {
    newGameModal.style.display = "none"; // Esconde o pop-up de Game Over
    settingsModal.style.display = "none"; // Esconde as configurações
    startPopup.style.display = "flex"; // Volta para a tela inicial
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
    userBalance += roundAmount;

    cardLeft.style.backgroundImage = isKingLeft
      ? "url('assets/images/rei.webp')"
      : "url('assets/images/rainha.webp')";
    cardRight.style.backgroundImage = isKingLeft
      ? "url('assets/images/rainha.webp')"
      : "url('assets/images/rei.webp')";

    const currentDateTime = new Date().toLocaleString();
    const kingSide = isKingLeft ? "Left" : "Right";

    let resultClass = won ? "win" : "loss";
    let resultText = won ? "🏆 Win" : "❌ Loss";
    let formattedAmount = (roundAmount > 0 ? "+" : "") + roundAmount.toFixed(2);

    historyBody.innerHTML = `
      <tr>
        <td>${currentRound}</td>
        <td class="${resultClass}">${resultText}</td>
        <td class="${resultClass}">${formattedAmount} €</td>
        <td>€${gameResult.toFixed(2)}</td>
        <td>${kingSide}</td>
        <td>${currentDateTime}</td>
      </tr>
    ` + historyBody.innerHTML;

    setTimeout(() => {    
      if (currentRound >= totalRounds) {
        endGame();
      } else {
        nextRound();
      }
    }, 1000);
  }

  function endGame() {
    const gameIndex = gamesBody.children.length + 1;
    const lastTotalBalance = userBalance.toFixed(2);
    const netResult = (gameResult - initialBet).toFixed(2);

    const gameData = {
        gameIndex: gameIndex,
        roundsPlayed: totalRounds,
        initialBet: initialBet.toFixed(2),
        initialBalance: initialGameBalance,
        result: netResult,
        totalBalance: lastTotalBalance,
        rounds: [...document.querySelectorAll("#history-body tr")].map(row => {
            const cells = row.querySelectorAll("td");
            return {
                round: cells[0]?.textContent || "0",
                result: cells[1]?.textContent.includes("Win") ? "Win" : "Loss",
                amount: cells[2]?.textContent.replace("€", "") || "0.00",
                gameTotal: cells[3]?.textContent.replace("€", "") || "0.00",
                kingSide: cells[4]?.textContent || "Unknown",
                dateTime: cells[5]?.textContent || "Unknown"
            };
        })
    };

    // Recupera a lista de jogos salvos ou cria uma nova
    let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    savedGames.unshift(gameData); // Adiciona o novo jogo ao início do array
    localStorage.setItem("savedGames", JSON.stringify(savedGames));

    localStorage.setItem("userBalance", userBalance.toFixed(2));

    addGameToTable(gameData);

    finalWinningsDisplay.textContent = netResult >= 0
        ? `🎉 Você ganhou €${netResult}!`
        : `😞 Você perdeu €${Math.abs(netResult)}`;

    finalWinningsDisplay.classList.toggle("loss", netResult < 0);
    finalWinningsDisplay.classList.toggle("win", netResult >= 0);

    totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;
    newGameModal.classList.remove("hidden");
    newGameModal.style.display = "flex";
}

// Função para exibir os detalhes do jogo
function showGameDetails(gameIndex) {
    const savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    const gameData = savedGames.find(game => game.gameIndex == gameIndex);

    if (!gameData) {
        alert("No data available for this game.");
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "dynamic-game-details-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Game ${gameIndex} Details</h2>
        <p><strong>Initial Bet:</strong> €${gameData.initialBet}</p>
        <p><strong>Initial Balance:</strong> €${gameData.initialBalance}</p>
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

// Delegação de evento para os botões "Details"
gamesBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("details-button")) {
        const gameIndex = event.target.dataset.gameIndex;
        showGameDetails(gameIndex);
    }
});


function loadSavedGames() {
  let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
  gamesBody.innerHTML = ""; // Limpa antes de recarregar para evitar duplicatas

  savedGames.forEach(game => {
      addGameToTable(game);
  });
}

function addGameToTable(gameData) {
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
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadSavedGames);



});
