/**
 * Construiește un șir alfanumeric (0-9, A-Z, a-z) folosit pentru generarea token-urilor.
 * @type {string}
 */
let sirAlphaNum = "";

/**
 * Intervalele de coduri ASCII pentru cifre, litere mari și litere mici.
 * @type {number[][]}
 */
const v_intervale = [
    [48, 57],   // 0-9
    [65, 90],   // A-Z
    [97, 122]   // a-z
];

// Construim șirul alfanumeric
for (let interval of v_intervale) {
    for (let i = interval[0]; i <= interval[1]; i++) {
        sirAlphaNum += String.fromCharCode(i);
    }
}

console.log(sirAlphaNum);

/**
 * Generează un token alfanumeric random.
 *
 * @function genereazaToken
 * @param {number} n - Lungimea tokenului dorit.
 * @returns {string} Tokenul generat, format din caractere alfanumerice.
 *
 * @example
 * const token = genereazaToken(32);
 * console.log(token); // ex: "A9f3Klm29D..."
 */
function genereazaToken(n) {
    let token = "";
    for (let i = 0; i < n; i++) {
        token += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)];
    }
    return token;
}

module.exports.genereazaToken = genereazaToken;
