import './styles/style.scss';
import { createCards, renderBoard, exitGame, updateExitDialogButtonText } from './ts/game';
import { setIconSrc } from './ts/ui';
import { showScreen } from './ts/router';
import { gameSettings, gameState } from './ts/state';
import { BoardSize, Theme } from './ts/types';

const SETTING_GROUPS = ['theme', 'player', 'board'];
// Get all theme preview images and the theme option labels
const previewImages = document.querySelectorAll('.settings__preview-img');
const themeLabels = document.querySelectorAll('.settings__option:has(input[name="theme"])');

/**
 * Shows the preview image for the given theme and hides all others.
 * @param theme - Name of the theme whose preview should be shown
 */
function showPreview(theme: string): void {
    previewImages.forEach((img) => img.setAttribute('hidden', ''));
    const img = document.querySelector(`.settings__preview-img[data-theme="${theme}"]`);
    img?.removeAttribute('hidden');
}

// Theme preview on hover: show the hovered theme, and on leave the selected one (fallback: code-vibes)
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

// Update the summary line live and re-check whether the start button can be enabled
settingsMain?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    updateSummaryFor(target.name);
    checkCheckedRadios();
});

// Home screen play button: opens the settings screen
const playBtn = document.getElementById('play-btn');
const gameScreen = document.getElementById('game-screen');

playBtn?.addEventListener('click', () => {
    showScreen('settings-screen');
});

/**
 * Assigns both players their color based on the first player's choice.
 * @param player - The color chosen by the first player ('blue' or 'orange')
 */
function setPlayerColors(player: string): void {
    if (player === 'blue') {
        gameSettings.players[0].color = 'blue';
        gameSettings.players[1].color = 'orange';
    } else {
        gameSettings.players[0].color = 'orange';
        gameSettings.players[1].color = 'blue';
    }
}

/**
 * Writes the label of the checked radio of a group into its summary span.
 * @param name - The radio group name ('theme', 'player' or 'board')
 */
function updateSummaryFor(name: string): void {
    const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
    const labelText = checked?.closest('.settings__option')?.querySelector('.settings__label')?.textContent;
    const summarySpan = document.getElementById(`summary-${name}`);
    if (summarySpan && labelText) {
        summarySpan.textContent = labelText;
    }
}

/**
 * Restores the settings screen from the still-selected radios:
 * summary text, theme preview and start button state.
 */
function restoreSettings(): void {
    SETTING_GROUPS.forEach((name) => updateSummaryFor(name));
    showPreview(getCheckedValue('theme') ?? 'code-vibes');
    checkCheckedRadios();
}

/**
 * Sets the exit button icons matching the selected theme (default + hover).
 * @param theme - The currently selected theme
 */
function setExitIcons(theme: Theme): void {
    const exitIconPath = `./assets/icons/setting_icons/exit-icon-${theme}.svg`;
    setIconSrc('exit-btn-icon', exitIconPath);

    // Only 'games' has its own hover icon, otherwise fall back to code-vibes
    const exitIconHoverPath = theme === 'games'
        ? './assets/icons/setting_icons/exit-icon-games-hover.svg'
        : './assets/icons/setting_icons/exit-icon-code-vibes.svg';
    setIconSrc('exit-btn-icon-hover', exitIconHoverPath);
}

/**
 * Returns the value of the currently selected radio in a group,
 * or null if none is selected.
 * @param name - The name attribute of the radio group ('theme', 'player', 'board')
 * @returns The selected value, or null if nothing is checked
 */
function getCheckedValue(name: string): string | null {
    const checked = document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null;
    return checked?.value ?? null;
}

/**
 * Enables the start button only when theme, player and board are all selected.
 */
function checkCheckedRadios(): void {
    const allChosen = getCheckedValue('theme') && getCheckedValue('player') && getCheckedValue('board');
    startBtn.disabled = !allChosen;
}

/**
 * Applies the selected theme and board size to the game settings.
 * @param theme - The selected theme
 * @param board - The selected board size
 */
function applyGameSettings(theme: Theme, board: BoardSize): void {
    gameSettings.theme = theme;
    gameScreen?.setAttribute('data-theme', theme);
    gameSettings.boardSize = board;
}

/**
 * Creates the cards and renders them onto the board.
 */
function buildBoard(): void {
    const cards = createCards();
    renderBoard(cards);
}

// Start button: reads the selected settings, configures the game and shows the board
startBtn?.addEventListener('click', () => {
    const theme = getCheckedValue('theme');
    const player = getCheckedValue('player');
    const board = getCheckedValue('board');

    // Safety check – button is only enabled when all three are selected
    if (!theme || !player || !board) return;

    applyGameSettings(theme as Theme, board as BoardSize);
    setExitIcons(theme as Theme);
    setPlayerColors(player);
    buildBoard();
    showScreen('game-screen');
});

// --- Exit dialog ---
const exitDialog = document.getElementById('exit-confirm-dialog') as HTMLDialogElement;

// Exit button in the scoreboard: opens the confirmation dialog
const exitBtn = document.getElementById('exit-game-btn');
exitBtn?.addEventListener('click', () => {
    exitDialog?.setAttribute('data-theme', gameState.settings.theme);
    updateExitDialogButtonText();
    exitDialog?.showModal();
});

/**
 * Closes the exit confirmation dialog.
 */
function closeExitDialog(): void {
    exitDialog?.close();
}

// "Back to game" button: just closes the dialog
const cancelExitBtn = document.getElementById('cancel-exit-btn');
cancelExitBtn?.addEventListener('click', closeExitDialog);

// "Exit game" button: closes the dialog, resets the game and returns to settings
const confirmExitBtn = document.getElementById('confirm-exit-btn');
confirmExitBtn?.addEventListener('click', () => {
    closeExitDialog();
    exitGame();
    restoreSettings();
    showScreen('settings-screen');
});

// Close the dialog when clicking on the backdrop (outside the dialog content)
exitDialog?.addEventListener('click', (event) => {
    if (event.target === exitDialog) {
        exitDialog.close();
    }
});

/**
 * Exits the current game, resets the settings and returns to the home screen.
 */
function goHome(): void {
    exitGame();
    restoreSettings();
    showScreen('home-screen');
}

// Home buttons on the winner and draw screens: return to the home screen
const homeBtn = document.getElementById('winner-home-btn');
const drawHomeBtn = document.getElementById('draw-home-btn');

homeBtn?.addEventListener('click', goHome);
drawHomeBtn?.addEventListener('click', goHome);