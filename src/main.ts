import './styles/style.scss';
import { createCards, renderBoard, exitGame, setIconSrc, updateExitDialogButtonText } from './ts/game';
import { showScreen } from './ts/router';
import { gameSettings, gameState } from './ts/state';
import { BoardSize, Theme } from './ts/types';


// Alle Theme-Radios greifen
const themeRadios = document.querySelectorAll('input[name="theme"]');
// Alle Vorschaubilder greifen
const previewImages = document.querySelectorAll('.settings__preview-img');

const themeLabels = document.querySelectorAll('.settings__option:has(input[name="theme"])');

themeLabels.forEach((label) => {
    const radio = label.querySelector('input[type="radio"]') as HTMLInputElement;

    label.addEventListener('mouseenter', () => {
        previewImages.forEach((img) => img.setAttribute('hidden', ''));
        const hoverImg = document.querySelector(`.settings__preview-img[data-theme="${radio.value}"]`);
        hoverImg?.removeAttribute('hidden');
    });

    label.addEventListener('mouseleave', () => {
        previewImages.forEach((img) => img.setAttribute('hidden', ''));
        const checkedRadio = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
        const activeImg = document.querySelector(`.settings__preview-img[data-theme="${checkedRadio.value}"]`);
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
    const exitIconPath = `/src/assets/icons/setting_icons/exit-icon-${theme}.svg`;
    setIconSrc('exit-btn-icon', exitIconPath);

    const exitIconHoverPath = theme === 'games'
        ? '/src/assets/icons/setting_icons/exit-icon-games-hover.svg'
        : '/src/assets/icons/setting_icons/exit-icon-code-vibes.svg';  // weiß für da-projects/food
    setIconSrc('exit-btn-icon-hover', exitIconHoverPath);
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

// Boad Dialog

const exitDialog = document.getElementById('exit-confirm-dialog') as HTMLDialogElement;

const exitBtn = document.getElementById('exit-game-btn');
exitBtn?.addEventListener('click', () => {
    exitDialog?.setAttribute('data-theme', gameState.settings.theme);
    updateExitDialogButtonText();
    exitDialog?.showModal();
});

function closeExitDialog() {
    exitDialog?.close();
}

const cancelExitBtn = document.getElementById('cancel-exit-btn');
cancelExitBtn?.addEventListener('click', closeExitDialog);

const confirmExitBtn = document.getElementById('confirm-exit-btn');
confirmExitBtn?.addEventListener('click', () => {
    closeExitDialog();
    exitGame();
    showScreen('settings-screen');
});

exitDialog?.addEventListener('click', (event) => {
    if (event.target === exitDialog) {
        exitDialog.close();
    }
});

function goHome() {
    exitGame();
    showScreen('home-screen');
}

const homeBtn = document.getElementById('winner-home-btn');
const drawHomeBtn = document.getElementById('draw-home-btn');

homeBtn?.addEventListener('click', goHome);
drawHomeBtn?.addEventListener('click', goHome);

