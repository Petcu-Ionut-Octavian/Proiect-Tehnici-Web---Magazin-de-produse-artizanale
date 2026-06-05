/*
 ATENTIE!
 inca nu am implementat protectia contra SQL injection
*/

const { Client, Pool } = require("pg");

class AccesBD {
    static #instanta = null;
    static #initializat = false;

    constructor() {
        if (AccesBD.#instanta) {
            throw new Error("Deja a fost instantiat");
        } else if (!AccesBD.#initializat) {
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }

    initLocal() {
        this.client = new Client({
            database: "artizania_db",
            user: "octavian",
            password: "octavian",
            host: "localhost",
            port: 5432
        });

        this.client.connect();

        // Exemplu de alt tip de conexiune:
        // this.client2= new Pool({database:"laborator",
        //         user:"irina", 
        //         password:"irina", 
        //         host:"localhost", 
        //         port:5432});
    }

    getClient() {
        if (!AccesBD.#instanta) {
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    /**
     * @typedef {object} ObiectConexiune - obiect primit de functiile care realizeaza un query
     * @property {string} init - tipul de conexiune ("init", "render" etc.)
     */

    /**
     * Returneaza instanta unica a clasei
     *
     * @param {ObiectConexiune} init - un obiect cu datele pentru query
     * @returns {AccesBD}
     */
    static getInstanta({ init = "local" } = {}) {
        console.log(this); // this-ul e clasa nu instanta pt ca metoda statica
        if (!this.#instanta) {
            this.#initializat = true;
            this.#instanta = new AccesBD();

            try {
                switch (init) {
                    case "local":
                        this.#instanta.initLocal();
                        break;
                }
            } catch (e) {
                console.error("Eroare la initializarea bazei de date!");
            }
        }
        return this.#instanta;
    }

    /**
     * Construieste clauza WHERE pe baza conditiiAnd / conditiiOr.
     * conditiiAnd: ["a=10","b=20"] => where a=10 and b=20
     * conditiiOr: [ ["a=10","b=20"], ["c=30","d=40"] ] => where (a=10 and b=20) or (c=30 and d=40)
     */
    static #construiesteWhere(conditiiAnd = [], conditiiOr = []) {
        if (conditiiOr && conditiiOr.length > 0) {
            const grupuri = conditiiOr.map(grup => "(" + grup.join(" and ") + ")");
            return "where " + grupuri.join(" or ");
        }

        if (conditiiAnd && conditiiAnd.length > 0) {
            return "where " + conditiiAnd.join(" and ");
        }

        return "";
    }

    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string[]} campuri - lista coloanelor
     * @property {string[]} [conditiiAnd] - lista de conditii legate cu AND
     * @property {string[][]} [conditiiOr] - lista de grupuri de conditii (AND in interior, OR intre grupuri)
     */

    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */

    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuerySelect} obj
     * @param {QueryCallBack} callback
     */
    select({ tabel = "", campuri = [], conditiiAnd = [], conditiiOr = [] } = {}, callback, parametriQuery = []) {
        let conditieWhere = AccesBD.#construiesteWhere(conditiiAnd, conditiiOr);
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);

        this.client.query(comanda, parametriQuery, callback);
    }

    async selectAsync({ tabel = "", campuri = [], conditiiAnd = [], conditiiOr = [] } = {}) {
        let conditieWhere = AccesBD.#construiesteWhere(conditiiAnd, conditiiOr);
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error("selectAsync:", comanda);
        try {
            let rez = await this.client.query(comanda);
            console.log("selectasync: ", rez);
            return rez;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    insert({ tabel = "", campuri = {} } = {}, callback) {
        console.log("-------------------------------------------");
        console.log(Object.keys(campuri).join(","));
        console.log(Object.values(campuri).join(","));
        let comanda = `insert into ${tabel}(${Object.keys(campuri).join(",")}) values (${Object.values(campuri).map(x => `'${x}'`).join(",")})`;
        console.log(comanda);
        this.client.query(comanda, callback);
    }

    /**
     * Update simplu (neparametrizat) cu suport pentru AND/OR.
     */
    update({ tabel = "", campuri = {}, conditiiAnd = [], conditiiOr = [] } = {}, callback) {
        let campuriActualizate = [];
        for (let prop in campuri)
            campuriActualizate.push(`${prop}='${campuri[prop]}'`);

        let conditieWhere = AccesBD.#construiesteWhere(conditiiAnd, conditiiOr);
        let comanda = `update ${tabel} set ${campuriActualizate.join(", ")} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda, callback);
    }

    /**
     * Update parametrizat (doar cu AND, ca in varianta originala).
     */
    updateParametrizat({ tabel = "", campuri = [], valori = [], conditiiAnd = [] } = {}, callback, parametriQuery) {
        if (campuri.length != valori.length)
            throw new Error("Numarul de campuri difera de nr de valori");

        let campuriActualizate = [];
        for (let i = 0; i < campuri.length; i++)
            campuriActualizate.push(`${campuri[i]}=$${i + 1}`);

        let conditieWhere = "";
        if (conditiiAnd.length > 0)
            conditieWhere = `where ${conditiiAnd.join(" and ")}`;

        let comanda = `update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", comanda);
        this.client.query(comanda, valori, callback);
    }

    /**
     * Delete cu suport pentru AND/OR.
     */
    delete({ tabel = "", conditiiAnd = [], conditiiOr = [] } = {}, callback) {
        let conditieWhere = AccesBD.#construiesteWhere(conditiiAnd, conditiiOr);
        let comanda = `delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda, callback);
    }

    query(comanda, callback) {
        this.client.query(comanda, callback);
    }
}

module.exports = AccesBD;
