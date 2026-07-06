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
    board?.classList.add(`board--${cards.length}`);
    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = String(card.id);

        const inner = document.createElement('div');
        inner.classList.add('card__inner');

        const front = document.createElement('div');
        front.classList.add('card__front');

        const frontImg = document.createElement('img');
        frontImg.src = `/src/assets/icons/${card.theme}/${card.imageUrl}`;
        frontImg.alt = '';

        const back = document.createElement('div');
        back.classList.add('card__back');

        const backImg = document.createElement('img');
        backImg.src = `/src/assets/icons/${card.theme}/back-icon.svg`;
        backImg.alt = '';
        
        cardElement.appendChild(inner);
        inner.appendChild(front);
        front.appendChild(frontImg);
        inner.appendChild(back);
        back.appendChild(backImg);
        board?.appendChild(cardElement);
    });
}

//Fisher-Yates-Shuffle