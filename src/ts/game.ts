import { gameSettings, gameState } from './state';
import { themeIcons } from './themeIcon';
import { CardData } from './types';
import { showScreen } from './router';

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
    updateScoreboard();
}

board?.addEventListener('click', (event) => {
    if (gameState.isLocked === true) return;
    const target = event.target as HTMLElement;
    const cardElement = target.closest('.card') as HTMLElement;
    if (!cardElement) return;
    if (cardElement.classList.contains('is-flipped')) return;
    cardElement.classList.toggle('is-flipped');
    const clickedCard = gameState.cards.find((card) => card.id === Number(cardElement.dataset.id));
    if (!clickedCard) return;
    gameState.flippedCards.push(clickedCard);
    if (gameState.flippedCards.length === 2) {
        gameState.isLocked = true;
        checkForMatch();
    }
});

function checkForMatch() {
    if (gameState.flippedCards[0].pairID === gameState.flippedCards[1].pairID) {
        gameState.flippedCards[0].isMatched = true;
        gameState.flippedCards[1].isMatched = true;
        gameState.flippedCards = [];
        gameState.isLocked = false;
        gameState.settings.players[gameState.currentPlayerIndex].score += 1;
        if (gameState.cards.every((card) => card.isMatched === true)) {
            getGameover();
        }
        updateScoreboard();
    } else {
        setTimeout(() => {
            gameState.flippedCards.forEach((card) => {
                const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
                cardElement?.classList.remove('is-flipped');

            });
            gameState.flippedCards = [];
            gameState.isLocked = false;
            gameState.currentPlayerIndex = (1 - gameState.currentPlayerIndex) as 0 | 1;
            updateScoreboard();
        }, 500);

    }

}

function getGameover() {

    const player1IconPath = `/src/assets/icons/${gameState.settings.theme}/player-icon-${gameState.settings.players[0].color}.svg`;
    const player2IconPath = `/src/assets/icons/${gameState.settings.theme}/player-icon-${gameState.settings.players[1].color}.svg`;

    const player1EndScore = document.getElementById('gameover-value-player-1');
    const player2EndScore = document.getElementById('gameover-value-player-2');

    if (player1EndScore) {
        player1EndScore.textContent = String(gameState.settings.players[0].score);
    }
    if (player2EndScore) {
        player2EndScore.textContent = String(gameState.settings.players[1].score);
    }

    setIconSrc('gameover-icon-player-1', player1IconPath);
    setIconSrc('gameover-icon-player-2', player2IconPath);
    showScreen('gameover-screen');
    
    setTimeout(() => {
        getWinner();
    }, 2000);
}


function getWinner() {
    const player1 = gameState.settings.players[0];
    const player2 = gameState.settings.players[1];
    const winPlayer = document.getElementById('winner-name');

    if (player1.score > player2.score) {
        if (winPlayer) {
            winPlayer.textContent = player1.name;
        }
        showScreen('winner-screen');
    } else if (player2.score > player1.score) {
        if (winPlayer) {
            winPlayer.textContent = player2.name;
        }
        showScreen('winner-screen');
    } else {
        showScreen('draw-screen');
    }
}


function updateScoreboard() {
    const player1Score = document.getElementById('value-player-1');
    const player2Score = document.getElementById('value-player-2');

    if (player1Score) {
        player1Score.textContent = String(gameState.settings.players[0].score);
    }
    if (player2Score) {
        player2Score.textContent = String(gameState.settings.players[1].score);
    }
    updateCurrentPlayer();
}

function setIconSrc(elementId: string, path: string) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('src', path);
    }
}

function updateCurrentPlayer() {
    const player1IconPath = `/src/assets/icons/${gameState.settings.theme}/player-icon-${gameState.settings.players[0].color}.svg`;
    const player2IconPath = `/src/assets/icons/${gameState.settings.theme}/player-icon-${gameState.settings.players[1].color}.svg`;
    const currentPlayerIconPath = gameState.currentPlayerIndex === 0 ? player1IconPath : player2IconPath;

    setIconSrc('icon-player-1', player1IconPath);
    setIconSrc('icon-player-2', player2IconPath);
    setIconSrc('current-player-icon', currentPlayerIconPath);
}

export function exitGame() {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.currentPlayerIndex = 0;
    gameState.isLocked = false;
    gameState.settings.players[0].score = 0;
    gameState.settings.players[1].score = 0;
    board?.replaceChildren();
    board?.classList.remove('board--16', 'board--24', 'board--36')
}


//Fisher-Yates-Shuffle