import { gameSettings } from './state';
import { themeIcons } from './themeIcon';
import { CardData } from './types';

export function createCards() {
    const cardCount = Number(gameSettings.boardSize);
    const pairCount = cardCount / 2;
    const selectedIcons = themeIcons[gameSettings.theme].slice(0, pairCount);
    const cardIcons = selectedIcons.concat(selectedIcons);

    const cards = cardIcons.map((icon, index) => ({
        id: index,
        pairID: index % pairCount,
        theme: gameSettings.theme,
        imageUrl: icon,
        isFlipped: false,
        isMatched: false,
    }));
    cards.sort(() => Math.random() - 0.5);
    return cards;
}

const board = document.getElementById('board');

export function renderBoard(cards: CardData[]) {
    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');                
        
        const img = document.createElement('img');
        img.src = `/src/assets/icons/${card.theme}/${card.imageUrl}`;
        img.alt = '';
        
        cardElement.appendChild(img);
        board?.appendChild(cardElement);                      
    });
}

//Fisher-Yates-Shuffle