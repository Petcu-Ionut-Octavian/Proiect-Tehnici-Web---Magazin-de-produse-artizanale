/**
 * Reprezintă un articol artizanal din baza de date.
 */
class Produs {

    /**
     * Creează un obiect Produs pe baza unui obiect primit (de obicei din DB).
     *
     * @param {Object} param0 - Obiect cu proprietăți corespunzătoare coloanelor din tabelul articole.
     * @param {number} param0.id - ID-ul produsului.
     * @param {string} param0.nume - Numele produsului.
     * @param {string} param0.descriere - Descrierea produsului.
     * @param {number} param0.pret - Prețul produsului.
     * @param {number} param0.greutate - Greutatea produsului.
     * @param {string} param0.tip_articol - Tipul de artizanat (ENUM).
     * @param {number} param0.complexitate - Complexitatea realizării.
     * @param {string} param0.categorie - Categoria produsului (ENUM).
     * @param {string[]} param0.materiale - Lista materialelor folosite.
     * @param {boolean} param0.este_ecologic - Dacă produsul este ecologic.
     * @param {string} param0.imagine - Numele fișierului imaginii.
     * @param {string} param0.data_adaugare - Data adăugării în DB.
     */
    constructor({
        id,
        nume,
        descriere,
        pret,
        greutate,
        tip_articol,
        complexitate,
        categorie,
        materiale,
        este_ecologic,
        imagine,
        data_adaugare
    } = {}) {

        this.id = id;
        this.nume = nume;
        this.descriere = descriere;
        this.pret = pret;
        this.greutate = greutate;
        this.tip_articol = tip_articol;
        this.complexitate = complexitate;
        this.categorie = categorie;
        this.materiale = materiale;
        this.este_ecologic = este_ecologic;
        this.imagine = imagine;
        this.data_adaugare = data_adaugare;
    }
}

module.exports = Produs;
