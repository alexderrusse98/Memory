/**
 * Sets the 'src' attribute of an image element by its ID.
 * @param elementId - ID of the image element
 * @param path - The image source path to set
 */
export function setIconSrc(elementId: string, path: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('src', path);
    }
}