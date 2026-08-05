import { gameState } from './state';
import { setIconSrc } from './ui';

/**
 * Sets the player color class ('is-blue' or 'is-orange') on an element,
 * removing any previous color class first.
 * @param elementId - ID of the element to update
 * @param color - The player color ('blue' or 'orange')
 */
export function setPlayerColorClass(elementId: string, color: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('is-blue', 'is-orange');
        element.classList.add(color === 'blue' ? 'is-blue' : 'is-orange');
    }
}

/**
 * Sets a color label, but only for the code-vibes theme (empty otherwise).
 * @param elementId - ID of the element to update
 * @param color - The color text to display
 */
export function setColorLabel(elementId: string, color: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = gameState.settings.theme === 'code-vibes' ? color : '';
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
 * Updates the scoreboard: score values, player colors/labels and current player.
 */
export function updateScoreboard(): void {
    const players = gameState.settings.players;

    updateScoreValues();
    setPlayerColorClass('score-group-player-1', players[0].color);
    setPlayerColorClass('score-group-player-2', players[1].color);
    setColorLabel('score-color-player-1', players[0].color);
    setColorLabel('score-color-player-2', players[1].color);

    updateCurrentPlayer();
}