/**
 * This function returns a random RGBA color string from a predefined array of colors.
 * @returns {string} A random RGBA color in the format 'rgba(r, g, b, a)'.
 */
function returnColor(){
    const rgbaColorArrays = [
        [255, 122, 0, 1],    // Orange
        [255, 113, 255, 1],  // Pink
        [110, 82, 255, 1],   // Purple
        [152, 39, 255, 1],   // Violet
        [0, 190, 232, 1],    // Light Blue
        [31, 215, 193, 1],   // Aqua
        [252, 89, 84, 1],    // Salmon
        [255, 163, 84, 1],   // Peach
        [248, 89, 255, 1],   // Magenta
        [255, 222, 70, 1],   // Yellow
        [70, 47, 138, 1],    // Royal Blue
        [190, 255, 43, 1],   // Lime Green
        [255, 246, 70, 1],   // Bright Yellow
        [255, 70, 70, 1],    // Red
        [255, 183, 84, 1]    // Orange-Yellow
    ];
    /**Generate a random index to select a color from the array */
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    /**Construct the RGBA color string */
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}
returnColor();