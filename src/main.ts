import './styles/style.scss';
import { createCards, renderBoard, exitGame, setIconSrc, updateExitDialogButtonText } from './ts/game';
import { showScreen } from './ts/router';
import { gameSettings, gameState } from './ts/state';
import { BoardSize, Theme } from './ts/types';

// Alle Vorschaubilder greifen
const previewImages = document.querySelectorAll('.settings__preview-img');
const themeLabels = document.querySelectorAll('.settings__option:has(input[name="theme"])');

function showPreview(theme: string) {
    previewImages.forEach((img) => img.setAttribute('hidden', ''));
    const img = document.querySelector(`.settings__preview-img[data-theme="${theme}"]`);
    img?.removeAttribute('hidden');
}

themeLabels.forEach((label) => {
    const radio = label.querySelector('input[type="radio"]') as HTMLInputElement;

    label.addEventListener('mouseenter', () => {
        showPreview(radio.value);
    });

    label.addEventListener('mouseleave', () => {
        const checkedRadio = document.querySelector('input[name="theme"]:checked') as HTMLInputElement | null;
        const themeToShow = checkedRadio?.value ?? 'code-vibes';
        showPreview(themeToShow);
    });
});

const startBtn = document.getElementById('start-btn') as HTMLButtonElement;

const settingsMain = document.querySelector('.settings__main');
settingsMain?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const settingName = target.name;
    const labelText = target.closest('.settings__option')?.querySelector('.settings__label')?.textContent;
    const summarySpan = document.getElementById(`summary-${settingName}`);
    if (summarySpan && labelText) {
        summarySpan.textContent = labelText;
    }
    checkCheckedRadios();
});

function checkCheckedRadios() {
    const themeChosen = document.querySelector('input[name="theme"]:checked');
    const playerChosen = document.querySelector('input[name="player"]:checked');
    const boardChosen = document.querySelector('input[name="board"]:checked');
    startBtn.disabled = !(themeChosen && playerChosen && boardChosen);
}

// home play btn
const playBtn = document.getElementById('play-btn');
const gameScreen = document.getElementById('game-screen');

playBtn?.addEventListener('click', () => {
    showScreen('settings-screen');
});

startBtn?.addEventListener('click', () => {
    const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value as Theme;
    const player = (document.querySelector('input[name="player"]:checked') as HTMLInputElement).value;
    const board = (document.querySelector('input[name="board"]:checked') as HTMLInputElement).value as BoardSize;

    gameSettings.theme = theme;
    gameScreen?.setAttribute('data-theme', theme);
    const exitIconPath = `/src/assets/icons/setting_icons/exit-icon-${theme}.svg`;
    setIconSrc('exit-btn-icon', exitIconPath);

    const exitIconHoverPath = theme === 'games'
        ? '/src/assets/icons/setting_icons/exit-icon-games-hover.svg'
        : '/src/assets/icons/setting_icons/exit-icon-code-vibes.svg';
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

// Board Dialog
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
    resetSettings();
    showScreen('settings-screen');
});

exitDialog?.addEventListener('click', (event) => {
    if (event.target === exitDialog) {
        exitDialog.close();
    }
});

function goHome() {
    exitGame();
    resetSettings();
    showScreen('home-screen');
}

function resetSettings() {
    startBtn.disabled = true;

    const radiosToReset = document.querySelectorAll<HTMLInputElement>(
        'input[name="theme"], input[name="player"], input[name="board"]'
    );
    radiosToReset.forEach((radio) => {
        radio.checked = false;
    });
    showPreview('code-vibes');
    const defaults = {
        'summary-theme': 'Game theme',
        'summary-player': 'Player',
        'summary-board': 'Board size',
    };

    Object.entries(defaults).forEach(([id, text]) => {
        const span = document.getElementById(id);
        if (span) span.textContent = text;
    });
}

const homeBtn = document.getElementById('winner-home-btn');
const drawHomeBtn = document.getElementById('draw-home-btn');

homeBtn?.addEventListener('click', goHome);
drawHomeBtn?.addEventListener('click', goHome);