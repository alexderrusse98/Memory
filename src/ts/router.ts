/**
 * Shows the screen with the given ID and hides all other screens.
 * @param screenId - ID of the screen section to display
 */
export function showScreen(screenId: string): void {
    const allScreens = document.querySelectorAll('main section');
    allScreens.forEach((screen) => {
        screen.setAttribute('hidden', '');
    });
    const targetScreen = document.getElementById(screenId);
    targetScreen?.removeAttribute('hidden');
}