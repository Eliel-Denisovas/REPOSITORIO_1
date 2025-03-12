// storage.js - Gerenciamento de localStorage

const STORAGE_KEYS = {
    BALANCE: "userBalance",
    GAMES: "savedGames"
};

export function getUserBalance() {
    const storedBalance = parseFloat(localStorage.getItem(STORAGE_KEYS.BALANCE));
    return isNaN(storedBalance) || storedBalance < 0 ? 1000.0 : storedBalance;
}

export function setUserBalance(balance) {
    localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toFixed(2));
}

export function getSavedGames() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMES)) || [];
}

export function saveGameResult(gameData) {
    const savedGames = getSavedGames();
    savedGames.unshift(gameData);
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(savedGames));
}

export function resetGameData() {
    localStorage.removeItem(STORAGE_KEYS.BALANCE);
    localStorage.removeItem(STORAGE_KEYS.GAMES);
}

export function loadSavedGames() {
    const savedGames = getSavedGames();
    const gamesBody = document.getElementById("games-body");

    if (!gamesBody) {
        console.error("Elemento 'games-body' não encontrado.");
        return;
    }

    gamesBody.innerHTML = "";

    savedGames.forEach(game => {
        gamesBody.insertAdjacentHTML("beforeend", `
        <tr>
            <td>Game ${game.gameIndex}</td>
            <td>${game.roundsPlayed}</td>
            <td>€${game.initialBet}</td>
            <td class="${game.result < 0 ? 'loss' : 'win'}">€${game.result}</td>
            <td>€${game.totalBalance}</td>
            <td><button class="details-button" data-game-index="${game.gameIndex}">Details</button></td>
        </tr>
        `);
    });

    document.querySelectorAll(".details-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const gameIndex = event.target.dataset.gameIndex;
            showGameDetails(gameIndex);
        });
    });
}
