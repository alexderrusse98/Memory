import type { GameSettings } from './types';

export const gameSettings: GameSettings = {
    theme: 'code-vibes',
    boardSize: '16',
    players: [
        { name: 'Player 1', score: 0, color: 'blue' },
        { name: 'Player 2', score: 0, color: 'orange' },
    ],
}