/** The four available game themes. */
export type Theme = 'code-vibes' | 'games' | 'da-projects' | 'food';

/** Possible board sizes (number of cards). */
export type BoardSize = '16' | '24' | '36';

/** A single player with their name, score and color. */
export interface Player {
    name: string;
    score: number;
    color: 'orange' | 'blue';
}

/** Represents a single card on the board. */
export interface CardData {
    id: number;
    pairID: number;        // shared ID between the two matching cards
    theme: Theme;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

/** The settings chosen by the user before starting a game. */
export interface GameSettings {
    theme: Theme;
    boardSize: BoardSize;
    players: [Player, Player];
}

/** The full live state of a running game. */
export interface GameState {
    settings: GameSettings;
    cards: CardData[];
    currentPlayerIndex: 0 | 1;   // 0 = player 1, 1 = player 2
    flippedCards: CardData[];
    isLocked: boolean;
    moves: number;
}