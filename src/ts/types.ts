export type Theme = 'code-vibes' | 'games' | 'da-projects' | 'food';

export type BoardSize =  '4x4' | '5x4' | '6x6';

export interface Player {
    name: string;
    score: number;
    color: 'orange' | 'blue';
}

export interface CardDate {
    id: number;
    pairID: number;
    theme: Theme;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface Gamesettings{
    theme: Theme;
    boardSize: BoardSize;
    players: [Player, Player];
}

export interface GameState {
    settings: Gamesettings;
    cards: CardData[];
    currentPlayerIndex: 0 | 1;
    flippedCards: CardData[];
    isLocked: boolean;
    moves: number; 
}
