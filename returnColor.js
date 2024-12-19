function returnColor(){
    const rgbaColorArrays = [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
    ];
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}
returnColor();