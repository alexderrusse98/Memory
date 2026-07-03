import { gameSettings } from './state';
import { themeIcons } from './themeIcon';

export function createCards() {
    const cardCount = Number(gameSettings.boardSize);
    const pairCount = cardCount / 2;
    const selectedIcons = themeIcons[gameSettings.theme].slice(0, pairCount);
    const cardIcons = selectedIcons.concat(selectedIcons);
    cardIcons.sort(() => Math.random() - 0.5);
    console.log('Selected Icons:', cardIcons);
}

//Fisher-Yates-Shuffle