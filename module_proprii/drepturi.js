/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori
 @property {Symbol} stergereUtilizatori
 @property {Symbol} cumparareProduse
 @property {Symbol} vizualizareGrafice
 @property {Symbol} vizualizareProduse
 @property {Symbol} modificareProduse
 @property {Symbol} stergereProduse
 */

/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    vizualizareGrafice: Symbol("vizualizareGrafice"),

    // Drepturi suplimentare
    vizualizareProduse: Symbol("vizualizareProduse"),
    modificareProduse: Symbol("modificareProduse"),
    stergereProduse: Symbol("stergereProduse")
};

module.exports = Drepturi;
