/**
 * This function returns a random RGBA color string from a predefined array of colors.
 * @returns {string} A random RGBA color in the format 'rgba(r, g, b, a)'.
 */
function returnColor(){
    const rgbaColorArrays = [
        [255, 122, 0, 1],
        [147, 39, 255, 1],
        [110, 82, 255, 1],
        [252, 113, 255, 1],
        [255, 187, 43, 1],
        [31, 215, 193, 1],
        [70, 47, 138, 1],
        [255, 70, 70, 1],
        [0, 190, 232, 1]
    ];
    /**Generate a random index to select a color from the array */
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    /**Construct the RGBA color string */
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}
returnColor();