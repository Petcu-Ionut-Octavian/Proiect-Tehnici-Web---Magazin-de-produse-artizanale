const AccesBD = require('./accesbd.js');
const parole = require('./parole.js');
const { RolFactory } = require('./roluri.js');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Reprezintă un utilizator din baza de date.
 */
class Utilizator {
    static tipConexiune = "local";
    static tabel = "utilizatori";
    static parolaCriptare = "tehniciweb";
    static emailServer = "test.tweb.node@gmail.com";
    static lungimeCod = 64;
    static numeDomeniu = "localhost:8080";

    #eroare;

    /**
     * Creează un obiect Utilizator pe baza unui obiect primit din DB.
     *
     * @param {Object} param0
     * @param {number} param0.id
     * @param {string} param0.username
     * @param {string} param0.nume
     * @param {string} param0.prenume
     * @param {string} param0.email
     * @param {string} param0.parola
     * @param {string|Object} param0.rol
     * @param {string} param0.culoare_chat
     * @param {string} param0.poza
     * @param {string} param0.cod
     * @param {boolean} param0.confirmat_mail
     * @param {string} param0.data_adaugare
     */
    constructor({
        id,
        username,
        nume,
        prenume,
        email,
        parola,
        rol,
        culoare_chat = "black",
        poza,
        cod,
        confirmat_mail,
        data_adaugare
    } = {}) {

        this.id = id;
        this.username = username;
        this.nume = nume;
        this.prenume = prenume;
        this.email = email;
        this.parola = parola;
        this.culoare_chat = culoare_chat;
        this.poza = poza;
        this.cod = cod;
        this.confirmat_mail = confirmat_mail;
        this.data_adaugare = data_adaugare;

        // conversie rol din string în obiect Rol
        if (rol)
            this.rol = rol.cod ? RolFactory.creeazaRol(rol.cod) : RolFactory.creeazaRol(rol);

        this.#eroare = "";
    }

    checkName(nume) {
        return nume !== "" && /^[A-Z][a-z]+$/.test(nume);
    }

    set setareNume(nume) {
        if (this.checkName(nume)) this.nume = nume;
        else throw new Error("Nume gresit");
    }

    checkUsername(username) {
        return username !== "" && /^[A-Za-z0-9#_./]+$/.test(username);
    }

    set setareUsername(username) {
        if (this.checkUsername(username)) this.username = username;
        else throw new Error("Username gresit");
    }

    static criptareParola(parola) {
        return crypto.scryptSync(parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Salvează utilizatorul în baza de date.
     */
    salvareUtilizator() {
        let parolaCriptata = Utilizator.criptareParola(this.parola);
        let utiliz = this;
        let token = parole.genereazaToken(100);

        AccesBD.getInstanta(Utilizator.tipConexiune).insert({
            tabel: Utilizator.tabel,
            campuri: {
                username: this.username,
                nume: this.nume,
                prenume: this.prenume,
                parola: parolaCriptata,
                email: this.email,
                culoare_chat: this.culoare_chat,
                cod: token,
                poza: this.poza
            }
        }, function (err, rez) {
            if (err) console.log(err);
            else utiliz.trimiteMail(
                "Te-ai inregistrat cu succes",
                "Username-ul tau este " + utiliz.username,
                `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p>
                 <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>
                 Click aici pentru confirmare</a></p>`
            );
        });
    }

    async trimiteMail(subiect, mesajText, mesajHtml, atasamente = []) {
        var transp = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {
                user: Utilizator.emailServer,
                pass: "rwgmgkldxnarxrgu"
            },
            tls: { rejectUnauthorized: false }
        });

        await transp.sendMail({
            from: Utilizator.emailServer,
            to: this.email,
            subject: subiect,
            text: mesajText,
            html: mesajHtml,
            attachments: atasamente
        });

        console.log("trimis mail");
    }

    static async getUtilizDupaUsernameAsync(username) {
        if (!username) return null;

        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: "utilizatori",
                campuri: ['*'],
                conditiiAnd: [`username='${username}'`]
            });

            if (rezSelect.rowCount !== 0)
                return new Utilizator(rezSelect.rows[0]);

            return null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static getUtilizDupaUsername(username, obparam, proceseazaUtiliz) {
        if (!username) return null;

        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: "utilizatori",
            campuri: ['*'],
            conditiiAnd: [`username='${username}'`]
        }, function (err, rezSelect) {
            let eroare = null;

            if (err) eroare = -2;
            else if (rezSelect.rowCount === 0) eroare = -1;

            let u = new Utilizator(rezSelect.rows[0]);
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    areDreptul(drept) {
        return this.rol.areDreptul(drept);
    }
}

module.exports = { Utilizator };
