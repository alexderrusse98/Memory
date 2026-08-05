import type { GameSettings, GameState } from './types';

/**
 * Default game settings: selected theme, board size and the two players.
 * Gets updated when the user makes selections on the settings screen.
 */
export const gameSettings: GameSettings = {
    theme: 'code-vibes',
    boardSize: '16',
    players: [
        { name: 'Player 1', score: 0, color: 'blue' },
        { name: 'Player 2', score: 0, color: 'orange' },
    ],
};

/**
 * Holds the live state of the current game (cards, turn, score, etc.).
 */
export const gameState: GameState = {
    settings: gameSettings,        // reference to the current game settings
    cards: [],                     // all cards currently on the board
    currentPlayerIndex: 0,         // 0 = player 1, 1 = player 2
    flippedCards: [],              // cards flipped in the current turn (max 2)
    isLocked: false,               // blocks clicks while cards are being compared
    moves: 0,                      // number of moves made so far
};