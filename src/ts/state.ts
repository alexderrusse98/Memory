import type { GameSettings, GameState } from './types';

export const gameSettings: GameSettings = {
    theme: 'code-vibes',
    boardSize: '16',
    players: [
        { name: 'Player 1', score: 0, color: 'blue' },
        { name: 'Player 2', score: 0, color: 'orange' },
    ],
}

export const gameState: GameState = {
  settings: gameSettings,      
  cards: [],            
  currentPlayerIndex: 0,
  flippedCards: [],
  isLocked: false,
  moves: 0,
};