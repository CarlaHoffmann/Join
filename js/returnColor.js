/**
 * This function returns a random RGBA color string from a predefined array of colors.
 * @returns {string} A random RGBA color in the format 'rgba(r, g, b, a)'.
 */
function returnColor(){
    const rgbaColorArrays = [
        [255, 122, 0, 1],  
        [255, 113, 255, 1],  
        [110, 82, 255, 1], 
        [152, 39, 255, 1], 
        [0, 190, 232, 1], 
        [31, 215, 193, 1],   
        [252, 89, 84, 1], 
        [255, 163, 84, 1],
        [248, 89, 255, 1],
        [255, 222, 70, 1],
        [70, 47, 138, 1],
        [190, 255, 43, 1], 
        [255, 246, 70, 1],
        [255, 70, 70, 1],   
        [255, 183, 84, 1]
    ];
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}
returnColor();