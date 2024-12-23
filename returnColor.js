/**
 * This function returns a random RGBA color string from a predefined array of colors.
 * @returns {string} A random RGBA color in the format 'rgba(r, g, b, a)'.
 */
function returnColor(){
    const rgbaColorArrays = [
        [255,122,0],
        [147,39,255],
        [110, 82, 255],
        [252, 113, 255],
        [255, 187, 43],
        [31,215,193]
    ];
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}
returnColor();