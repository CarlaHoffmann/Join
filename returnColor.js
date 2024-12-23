/**
 * This function returns a random RGBA color string from a predefined array of colors.
 * @returns {string} A random RGBA color in the format 'rgba(r, g, b, a)'.
 */
function returnColor(){
    const rgbaColorArrays = [
        [255,122,0],    /**Orange */
        [147,39,255],   /**Purple */
        [110, 82, 255], /**Light Blue */
        [252, 113, 255],/**Pink */
        [255, 187, 43], /**Yellow */
        [31,215,193]    /**Teal */
    ];
    /**Generate a random index to select a color from the array */
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    /**Construct the RGBA color string */
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}
returnColor();