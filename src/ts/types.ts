export type Theme = 'code-vibes' | 'games' | 'da-projects' | 'food';

export type BoardSize =  '16' | '24' | '32';

export interface Player {
    name: string;
    score: number;
    color: 'orange' | 'blue';
}

export interface CardData {
    id: number;
    pairID: number;
    theme: Theme;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface GameSettings{
    theme: Theme;
    boardSize: BoardSize;
    players: [Player, Player];
}

export interface GameState {
    settings: GameSettings;
    cards: CardData[];
    currentPlayerIndex: 0 | 1;
    flippedCards: CardData[];
    isLocked: boolean;
    moves: number; 
}
