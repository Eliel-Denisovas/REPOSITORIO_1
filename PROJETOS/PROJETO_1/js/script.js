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
    let gameWinTotal = 0;
    let initialBet = 10.00; // Para registrar no histórico
  
    // 📌 Inicialização do jogo
    function initializeGame() {
      startPopup.style.display = "flex";  
      settingsModal.style.display = "none";  
      newGameModal.style.display = "none";  
      gameContainer.style.display = "none";  
      recordsContainer.classList.add("hidden");
    }
    initializeGame();
  
    // 📌 Fechar pop-up inicial e abrir as configurações ao clicar em "Play"
    playButton.addEventListener("click", () => {
      startPopup.style.display = "none";  
      settingsModal.style.display = "flex";  
    });
  
    // 📌 Exibir/ocultar registros
    toggleRecords.addEventListener("click", () => {
      recordsContainer.classList.toggle("hidden");
    });
  
    // 🚀 Iniciar jogo ao clicar em "Start Game"
    startButton.addEventListener("click", () => {
      betAmount = parseFloat(document.getElementById("bet").value);
      totalRounds = parseInt(document.getElementById("rounds").value);
      gameWinTotal = betAmount; 
      initialBet = betAmount; // Salvar aposta inicial
      currentRound = 0;
      
      totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;
      historyBody.innerHTML = ""; // Limpar histórico do jogo anterior
  
      settingsModal.style.display = "none";  
      gameContainer.style.display = "block";  
  
      nextRound();
    });
  
    // 🎲 Iniciar nova rodada
    function nextRound() {
      if (currentRound >= totalRounds) {
        endGame();
        return;
      }
  
      currentRound++;
  
      // 🃏 Resetar cartas para a imagem de fundo
      cardLeft.style.backgroundImage = "url('../assets/images/fundo.webp')";
      cardRight.style.backgroundImage = "url('../assets/images/fundo.webp')";
  
      // Permitir que o usuário escolha uma carta
      cardLeft.addEventListener("click", chooseCard);
      cardRight.addEventListener("click", chooseCard);
    }
  
    // 🃏 Escolher carta e definir resultado
    function chooseCard(event) {
      // Remover os listeners para evitar múltiplos cliques
      cardLeft.removeEventListener("click", chooseCard);
      cardRight.removeEventListener("click", chooseCard);
  
      const isKingLeft = Math.random() > 0.5; // Define aleatoriamente onde está o Rei
      const won = event.target === (isKingLeft ? cardLeft : cardRight);
      let roundAmount = won ? betAmount : -betAmount / 2;
      let newTotal = gameWinTotal + roundAmount; // Atualiza o total do jogo
  
      // Revelar as cartas
      cardLeft.style.backgroundImage = isKingLeft
        ? "url('../assets/images/rei.webp')"
        : "url('../assets/images/rainha.webp')";
      cardRight.style.backgroundImage = isKingLeft
        ? "url('../assets/images/rainha.webp')"
        : "url('../assets/images/rei.webp')";
  
      // Atualizar valores
      betAmount = won ? betAmount * 2 : betAmount / 2;
      gameWinTotal = newTotal;
  
      // 🟢🔴 Definir classe para exibir resultado
      let resultClass = won ? "win" : "loss";
      let resultText = won ? "🏆 Win" : "❌ Loss";
      let formattedAmount = (roundAmount > 0 ? "+" : "") + roundAmount.toFixed(2);
  
      // Atualizar histórico de rodadas
      historyBody.innerHTML = `
        <tr>
          <td>${currentRound}</td>
          <td class="${resultClass}">${resultText}</td>
          <td class="${resultClass}">${formattedAmount} €</td>
          <td>${gameWinTotal.toFixed(2)} €</td>
        </tr>
      ` + historyBody.innerHTML;
  
      setTimeout(nextRound, 1000);
    }
  
    // 🏁 Finalizar jogo e registrar resultado
    function endGame() {
      userBalance += gameWinTotal; // Atualiza o saldo do jogador
      totalBalanceDisplay.textContent = `€${userBalance.toFixed(2)}`;
  
      // Registrar resultado no histórico de jogos
      gamesBody.insertAdjacentHTML("afterbegin", `
        <tr>
          <td>Game ${gamesBody.children.length + 1}</td>
          <td>${totalRounds}</td>
          <td>€${initialBet.toFixed(2)}</td>
          <td class="${gameWinTotal >= 0 ? 'win' : 'loss'}">€${gameWinTotal.toFixed(2)}</td>
        </tr>
      `);
  
      finalWinningsDisplay.textContent = `€${gameWinTotal.toFixed(2)}`;
      newGameModal.style.display = "flex";  
    }
  
    // 🔄 Reiniciar jogo
    restartButton.addEventListener("click", () => {
      newGameModal.style.display = "none";
      settingsModal.style.display = "flex";
    });
  });
  