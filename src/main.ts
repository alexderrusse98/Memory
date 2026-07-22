import './styles/style.scss';
import { createCards, renderBoard, exitGame } from './ts/game';
import { showScreen } from './ts/router';
import { gameSettings } from './ts/state';
import { BoardSize, Theme } from './ts/types';


// Alle Theme-Radios greifen
const themeRadios = document.querySelectorAll('input[name="theme"]');
// Alle Vorschaubilder greifen
const previewImages = document.querySelectorAll('.settings__preview-img');

themeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        previewImages.forEach((img) => {
            img.setAttribute('hidden', '');
        });

        const selectedTheme = (radio as HTMLInputElement).value;
        const activeImg = document.querySelector(`.settings__preview-img[data-theme="${selectedTheme}"]`);
        activeImg?.removeAttribute('hidden');
    });
});


// home play btn
const playBtn = document.getElementById('play-btn');

const gameScreen = document.getElementById('game-screen');

playBtn?.addEventListener('click', () => {
    showScreen('settings-screen');
});

const startGameBtn = document.getElementById('start-btn');
startGameBtn?.addEventListener('click', () => {
    const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value as Theme;
    const player = (document.querySelector('input[name="player"]:checked') as HTMLInputElement).value;
    const board = (document.querySelector('input[name="board"]:checked') as HTMLInputElement).value as BoardSize;

    gameSettings.theme = theme;
    gameScreen?.setAttribute('data-theme', theme);
    gameSettings.boardSize = board;
    if (player === 'blue') {
        gameSettings.players[0].color = 'blue';
        gameSettings.players[1].color = 'orange';
    } else {
        gameSettings.players[0].color = 'orange';
        gameSettings.players[1].color = 'blue';
    }
    const cards = createCards();
    renderBoard(cards);
    showScreen('game-screen');

});


const exitBtn = document.getElementById('exit-game-btn');

exitBtn?.addEventListener('click', () => {
    exitGame();
    showScreen('settings-screen');
});

function goHome() {
    exitGame();
    showScreen('home-screen');
}

const homeBtn = document.getElementById('winner-home-btn');
const drawHomeBtn = document.getElementById('draw-home-btn');

homeBtn?.addEventListener('click', goHome);
drawHomeBtn?.addEventListener('click', goHome);