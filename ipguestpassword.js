function generatePassword(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz123456789$§!&%";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

console.log(generatePassword(24));
console.log(Math.round(Math.random())*6+1); //nur 1 und 7?!