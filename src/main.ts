import './styles/style.scss';

// Alle Theme-Radios greifen
const themeRadios = document.querySelectorAll('input[name="theme"]');

// Alle Vorschaubilder greifen
const previewImages = document.querySelectorAll('.settings__preview-img');

themeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        // alle verstecken
        previewImages.forEach((img) => {
            img.setAttribute('hidden', '');
        });

        // passendes zeigen
        const selectedTheme = (radio as HTMLInputElement).value;
        const activeImg = document.querySelector(`.settings__preview-img[data-theme="${selectedTheme}"]`);
        activeImg?.removeAttribute('hidden');
    });
});