export function showScreen(screenId: string): void {
    const allScreens = document.querySelectorAll('main section');
    allScreens.forEach((screen) => {
        screen.setAttribute('hidden', '');
    });
    const targetScreen = document.getElementById(screenId);
    targetScreen?.removeAttribute('hidden');
}