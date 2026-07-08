import { gameSettings, gameState } from './state';
import { themeIcons } from './themeIcon';
import { CardData } from './types';

const board = document.getElementById('board');

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
    gameState.cards = cards;
    return cards;
}



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

board?.addEventListener('click', (event) => {
    if (gameState.isLocked === true) return;
    const target = event.target as HTMLElement;
    const cardElement = target.closest('.card') as HTMLElement;
    if (!cardElement) return;
    cardElement.classList.toggle('is-flipped');
    const clickedCard = gameState.cards.find((card) => card.id === Number(cardElement.dataset.id));
    if (!clickedCard) return;
    gameState.flippedCards.push(clickedCard);
    if (gameState.flippedCards.length === 2) {
        gameState.isLocked = true;
        checkForMatch();
        console.log('zwei Karten aufgedeckt!', gameState.isLocked);
    }
});

function checkForMatch() {
    if (gameState.flippedCards[0].pairID === gameState.flippedCards[1].pairID) {
        gameState.flippedCards[0].isMatched = true;
        gameState.flippedCards[1].isMatched = true;
        gameState.flippedCards = [];
        gameState.isLocked = false;
    } else {
        setTimeout(() => {
            gameState.flippedCards.forEach((card) => {
                const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
                cardElement?.classList.remove('is-flipped');

            });
            gameState.flippedCards = [];
            gameState.isLocked = false;
        }, 1000);
    }

}



//Fisher-Yates-Shuffle