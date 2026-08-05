import { gameSettings, gameState } from './state';
import { themeIcons } from './themeIcon';
import { CardData, Player } from './types';
import { showScreen } from './router';
import { updateScoreboard, setPlayerColorClass, setColorLabel } from './scoreboard';
import { setIconSrc } from './ui';

const MISMATCH_DELAY_MS = 500;
const WINNER_DELAY_MS = 2000;
const board = document.getElementById('board');

/**
 * Shuffles an array in place using a random sort order.
 * @param array - The array to shuffle
 */
function shuffle<T>(array: T[]): void {
    array.sort(() => Math.random() - 0.5);
}

/**
 * Builds card objects from a list of icons.
 * @param icons - The list of icon file names (already duplicated into pairs)
 * @param pairCount - Number of unique pairs, used to calculate the pair ID
 * @returns An array of card objects
 */
function buildCards(icons: string[], pairCount: number): CardData[] {
    return icons.map((icon, index) => ({
        id: index,
        pairID: index % pairCount,
        theme: gameSettings.theme,
        imageUrl: icon,
        isFlipped: false,
        isMatched: false,
    }));
}

/**
 * Creates a shuffled set of card pairs for the current theme and board size,
 * stores them in the game state and returns them.
 * @returns The generated array of cards
 */
export function createCards(): CardData[] {
    const cardCount = Number(gameSettings.boardSize);
    const pairCount = cardCount / 2;

    // Take one icon per pair, then duplicate to get matching pairs
    const selectedIcons = themeIcons[gameSettings.theme].slice(0, pairCount);
    const cardIcons = selectedIcons.concat(selectedIcons);

    const cards = buildCards(cardIcons, pairCount);
    shuffle(cards);
    gameState.cards = cards;
    return cards;
}

/**
 * Creates one side of a card (front or back) with its image.
 * @param sideClass - The CSS class for the side ('card__front' or 'card__back')
 * @param imgSrc - The image source path
 * @returns The finished side element
 */
function createCardSide(sideClass: string, imgSrc: string): HTMLDivElement {
    const side = document.createElement('div');
    side.classList.add(sideClass);
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = '';
    side.appendChild(img);
    return side;
}

/**
 * Creates a single card DOM element with its front and back sides.
 * @param card - The card data to build the element from
 * @returns The finished card element
 */
function createCardElement(card: CardData): HTMLDivElement {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = String(card.id);

    const inner = document.createElement('div');
    inner.classList.add('card__inner');

    const front = createCardSide('card__front', `/src/assets/icons/${card.theme}/${card.imageUrl}`);
    const back = createCardSide('card__back', `/src/assets/icons/${card.theme}/back-icon.svg`);

    inner.append(front, back);
    cardElement.appendChild(inner);
    return cardElement;
}

/**
 * Renders all cards onto the board and updates the scoreboard.
 * @param cards - The cards to render
 */
export function renderBoard(cards: CardData[]): void {
    board?.classList.add(`board--${cards.length}`);
    cards.forEach((card) => {
        board?.appendChild(createCardElement(card));
    });
    updateScoreboard();
}

// Board click handler (event delegation): flips the clicked card and checks for a match on the second flip
board?.addEventListener('click', (event) => {
    if (gameState.isLocked === true) return;   // ignore clicks while two cards are being compared

    const target = event.target as HTMLElement;
    const cardElement = target.closest('.card') as HTMLElement;
    if (!cardElement) return;                          // click was not on a card
    if (cardElement.classList.contains('is-flipped')) return;   // card already flipped

    cardElement.classList.toggle('is-flipped');

    const clickedCard = gameState.cards.find((card) => card.id === Number(cardElement.dataset.id));
    if (!clickedCard) return;

    gameState.flippedCards.push(clickedCard);

    // Once two cards are flipped, lock the board and check if they match
    if (gameState.flippedCards.length === 2) {
        gameState.isLocked = true;
        checkForMatch();
    }
});

/**
 * Handles a successful match: marks both cards, awards a point to the
 * current player and ends the game if all cards are matched.
 */
function handleMatch(): void {
    gameState.flippedCards[0].isMatched = true;
    gameState.flippedCards[1].isMatched = true;
    gameState.flippedCards = [];
    gameState.isLocked = false;
    gameState.settings.players[gameState.currentPlayerIndex].score += 1;

    if (gameState.cards.every((card) => card.isMatched)) {
        getGameover();
    }
    updateScoreboard();
}

/**
 * Handles a failed match: flips both cards back after a short delay
 * and switches to the other player.
 */
function handleMismatch(): void {
    setTimeout(() => {
        gameState.flippedCards.forEach((card) => {
            const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
            cardElement?.classList.remove('is-flipped');
        });
        gameState.flippedCards = [];
        gameState.isLocked = false;
        gameState.currentPlayerIndex = (1 - gameState.currentPlayerIndex) as 0 | 1;
        updateScoreboard();
    }, MISMATCH_DELAY_MS);
}

/**
 * Compares the two flipped cards and delegates to the match or mismatch handler.
 */
function checkForMatch(): void {
    const [first, second] = gameState.flippedCards;
    if (first.pairID === second.pairID) {
        handleMatch();
    } else {
        handleMismatch();
    }
}

/**
 * Displays both players' final scores on the gameover screen.
 */
function showFinalScores(): void {
    const player1EndScore = document.getElementById('gameover-value-player-1');
    const player2EndScore = document.getElementById('gameover-value-player-2');
    if (player1EndScore) {
        player1EndScore.textContent = String(gameState.settings.players[0].score);
    }
    if (player2EndScore) {
        player2EndScore.textContent = String(gameState.settings.players[1].score);
    }
}

/**
 * Applies the current theme to all three end screens (gameover, winner, draw).
 */
function applyThemeToEndScreens(): void {
    const theme = gameState.settings.theme;
    document.getElementById('gameover-screen')?.setAttribute('data-theme', theme);
    document.getElementById('winner-screen')?.setAttribute('data-theme', theme);
    document.getElementById('draw-screen')?.setAttribute('data-theme', theme);
}

/**
 * Sets the player icons and color labels/classes on the gameover screen.
 */
function setupGameoverPlayers(): void {
    const { theme, players } = gameState.settings;
    const iconPath = (color: string) => `/src/assets/icons/${theme}/player-icon-${color}.svg`;

    setIconSrc('gameover-icon-player-1', iconPath(players[0].color));
    setIconSrc('gameover-icon-player-2', iconPath(players[1].color));
    setColorLabel('gameover-color-player-1', players[0].color);
    setColorLabel('gameover-color-player-2', players[1].color);
    setPlayerColorClass('gameover-score-player-1', players[0].color);
    setPlayerColorClass('gameover-score-player-2', players[1].color);
}

/**
 * Shows the gameover screen with final scores, then reveals the winner
 * or draw screen after a short delay.
 */
function getGameover(): void {
    showFinalScores();
    applyThemeToEndScreens();
    setupGameoverPlayers();
    showScreen('gameover-screen');

    setTimeout(getWinner, WINNER_DELAY_MS);
}

/**
 * Sets the home button text depending on the theme:
 * 'Back to start' for code-vibes, 'Home' for all other themes.
 * @param elementId - ID of the button to update
 */
function setHomeButtonText(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = gameState.settings.theme === 'code-vibes' ? 'Back to start' : 'Home';
    }
}

/**
 * Returns the winner icon path for the given player, depending on the theme.
 * @param player - The winning player
 * @returns The path to the matching winner icon
 */
function getWinnerIconPath(player: Player): string {
    const theme = gameState.settings.theme;
    if (theme === 'games') {
        return '/src/assets/icons/players/pokal.svg';
    }
    if (theme === 'da-projects') {
        return `/src/assets/icons/players/player-${player.color}-white.svg`;
    }
    return `/src/assets/icons/players/player-${player.color}.svg`;
}

/**
 * Shows the winner screen for the given player (name, color and icon).
 * @param player - The winning player
 */
function showWinner(player: Player): void {
    const winPlayer = document.getElementById('winner-name');
    const playerName = player.color === 'blue' ? 'Blue Player' : 'Orange Player';

    if (winPlayer) {
        winPlayer.textContent = playerName;
    }
    setPlayerColorClass('winner-name', player.color);
    setIconSrc('winner-icon', getWinnerIconPath(player));
    showScreen('winner-screen');
}

/**
 * Shows the draw screen with the theme-specific scale and title images.
 */
function showDraw(): void {
    const theme = gameState.settings.theme;
    setIconSrc('draw-icon', `/src/assets/icons/scales/scale-${theme}.svg`);
    setIconSrc('draw-title-img', `/src/assets/icons/${theme}/draw-${theme}.svg`);
    showScreen('draw-screen');
}

/**
 * Determines the game result and shows the winner or draw screen.
 */
function getWinner(): void {
    const [player1, player2] = gameState.settings.players;

    setHomeButtonText('winner-home-btn');
    setHomeButtonText('draw-home-btn');

    if (player1.score > player2.score) {
        showWinner(player1);
    } else if (player2.score > player1.score) {
        showWinner(player2);
    } else {
        showDraw();
    }
}

/**
 * Updates both players' score numbers in the scoreboard.
 */
function updateScoreValues(): void {
    const player1Score = document.getElementById('value-player-1');
    const player2Score = document.getElementById('value-player-2');
    if (player1Score) {
        player1Score.textContent = String(gameState.settings.players[0].score);
    }
    if (player2Score) {
        player2Score.textContent = String(gameState.settings.players[1].score);
    }
}

/**
 * Updates the player icons in the scoreboard and highlights the current player.
 * In the code-vibes theme the current player icon uses the player's color,
 * otherwise it uses a white variant.
 */
function updateCurrentPlayer(): void {
    const theme = gameState.settings.theme;
    const players = gameState.settings.players;

    const player1IconPath = `/src/assets/icons/${theme}/player-icon-${players[0].color}.svg`;
    const player2IconPath = `/src/assets/icons/${theme}/player-icon-${players[1].color}.svg`;

    const currentPlayerColor = players[gameState.currentPlayerIndex].color;
    // code-vibes uses the colored icon, all other themes use the white variant
    const currentPlayerIconColor = theme === 'code-vibes' ? currentPlayerColor : 'white';
    const currentPlayerIconPath = `/src/assets/icons/${theme}/player-icon-${currentPlayerIconColor}.svg`;

    setIconSrc('icon-player-1', player1IconPath);
    setIconSrc('icon-player-2', player2IconPath);
    setIconSrc('current-player-icon', currentPlayerIconPath);
    setPlayerColorClass('current-player-badge', currentPlayerColor);
}

/**
 * Sets the exit dialog button texts depending on the theme.
 * games and food use more expressive labels, all other themes use plain ones.
 */
export function updateExitDialogButtonText(): void {
    const cancelBtn = document.getElementById('cancel-exit-btn');
    const confirmBtn = document.getElementById('confirm-exit-btn');
    const theme = gameState.settings.theme;

    if (cancelBtn) {
        cancelBtn.textContent = (theme === 'games' || theme === 'food')
            ? 'No, back to game'
            : 'Back to game';
    }
    if (confirmBtn) {
        confirmBtn.textContent = (theme === 'games')
            ? 'Yes, quit game'
            : 'Exit game';
    }
}

/**
 * Resets the game state and clears the board, so a new game can start clean.
 */
export function exitGame(): void {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.currentPlayerIndex = 0;
    gameState.isLocked = false;
    gameState.settings.players[0].score = 0;
    gameState.settings.players[1].score = 0;
    board?.replaceChildren();                                      // remove all card elements from the board
    board?.classList.remove('board--16', 'board--24', 'board--36'); // clear any board size class
}