const express= require("express");
const path= require("path");
const fs=require("fs");
const sharp = require("sharp");
const pg = require("pg");
let sass;
try {
    sass = require("sass");
} catch (err) {
    console.warn("[Warning] modul sass nu este instalat. SCSS nu va fi compilat", err.message);
}

app= express();
app.set("view engine", "ejs")

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

let vect_foldere=[ "temp", "logs", "backup", "fisiere_uploadate" ]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});   
    }
}
 
// Verificarea din etapa 4 - erori.json
function verificaEroriJSON() {
    const caleFisier = path.join(__dirname, "resurse/json/erori.json");

    // 1. Existența fișierului
    if (!fs.existsSync(caleFisier)) {
        console.error("[EROARE CRITICĂ] Fișierul erori.json NU există! Serverul se oprește.");
        process.exit();
    }

    // 2. Citire brută pentru detectarea proprietăților duplicate
    const continutBrut = fs.readFileSync(caleFisier, "utf-8");

    // Detectare proprietăți duplicate în orice obiect JSON
    const regexObj = /{[\s\S]*?}/g;
    const obiecte = continutBrut.match(regexObj) || [];

    for (let objText of obiecte) {
        const regexProp = /"([^"]+)"\s*:/g;
        let match;
        const props = {};

        while ((match = regexProp.exec(objText)) !== null) {
            const prop = match[1];
            if (props[prop]) {
                console.error(`[EROARE] Proprietatea "${prop}" apare de mai multe ori în obiectul:\n${objText}`);
            }
            props[prop] = true;
        }
    }

    // 3. Parsare JSON
    let erori;
    try {
        erori = JSON.parse(continutBrut);
    } catch (err) {
        console.error("[EROARE] JSON invalid în erori.json:", err.message);
        return;
    }

    // 4. Verificare proprietăți obligatorii
    const propObl = ["info_erori", "cale_baza", "eroare_default"];
    for (let p of propObl) {
        if (!(p in erori)) {
            console.error(`[EROARE] Lipsește proprietatea obligatorie "${p}" din erori.json`);
        }
    }

    // 5. Verificare proprietăți obligatorii în eroarea default
    const def = erori.eroare_default || {};
    const propDef = ["titlu", "text", "imagine"];
    for (let p of propDef) {
        if (!(p in def)) {
            console.error(`[EROARE] În eroarea default lipsește proprietatea "${p}"`);
        }
    }

    // 6. Verificare existență folder cale_baza
    const caleBazaAbs = path.join(__dirname, erori.cale_baza || "");
    if (!fs.existsSync(caleBazaAbs)) {
        console.error(`[EROARE] Folderul cale_baza NU există: ${caleBazaAbs}`);
    }

    // 7. Verificare existență imagini + imagini unice
    const imaginiVazute = new Set();
    const toateErorile = [erori.eroare_default, ...erori.info_erori];

    for (let eroare of toateErorile) {
        const caleImgAbs = path.join(caleBazaAbs, eroare.imagine || "");

        if (!fs.existsSync(caleImgAbs)) {
            console.error(`[EROARE] Imaginea specificată NU există: ${caleImgAbs}`);
        }

        if (imaginiVazute.has(eroare.imagine)) {
            console.error(`[EROARE] Imagine duplicată detectată: "${eroare.imagine}". Fiecare eroare trebuie să aibă altă imagine.`);
        }
        imaginiVazute.add(eroare.imagine);
    }

    // 8. Verificare identificatori duplicat
    const mapId = {};
    for (let eroare of erori.info_erori) {
        const id = eroare.identificator;
        if (!mapId[id]) mapId[id] = [];
        mapId[id].push(eroare);
    }

    for (let id in mapId) {
        if (mapId[id].length > 1) {
            console.error(`[EROARE] Identificator duplicat: ${id}`);
            console.error("Obiectele conflictuale (fără identificator):");
            for (let obj of mapId[id]) {
                const { identificator, ...rest } = obj;
                console.error(rest);
            }
        }
    }

    console.log("[OK] Verificarea erori.json s-a încheiat.");
}


// CONFIGURARE BAZA DE DATE
client=new pg.Client({
    database:"artizania_db",
    user:"octavian",
    password:"octavian",
    host:"localhost",
    port:5432
})

client.connect()

// client.query("select * from articole", function(err,rez) {
//     if (err){
//         console.log("Eroare la interogare", err);
//     } else {
//         console.log("Rezultat interogare", rez);
//     }
// })



app.use("/resurse",express.static(path.join(__dirname, "resurse")));
app.use("/dist",express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use("/bootstrap-icons", express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")));




// ERORI
function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }

}
verificaEroriJSON();
initErori()

function afisareEroare(res, identificator = 0, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find(elem => elem.identificator == identificator);
    let eroareDefault = obGlobal.obErori.eroare_default;
    if(eroare?.status)
        res.status(eroare.identificator);
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || eroareDefault.imagine,
        titlu: titlu || eroare?.titlu || eroareDefault.titlu,
        text: text || eroare?.text || eroareDefault.text
    });
};




// SCSS
// function compileazaScss(caleScss, caleCss){
//     if(!caleCss){

//         let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
//         let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
//         caleCss=numeFis+".css"; // output: a.css
//     }
    
//     if (!path.isAbsolute(caleScss))
//         caleScss=path.join(obGlobal.folderScss,caleScss )
//     if (!path.isAbsolute(caleCss))
//         caleCss=path.join(obGlobal.folderCss,caleCss )
    
//     let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
//     if (!fs.existsSync(caleBackup)) {
//         fs.mkdirSync(caleBackup,{recursive:true})
//     }
    
//     // la acest punct avem cai absolute in caleScss si  caleCss

//     let numeFisCss=path.basename(caleCss);
//     if (fs.existsSync(caleCss)){
//         fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
//     }

//     if (!sass) {
//         console.warn("SCSS compilation skipped: modul sass nu este disponibil.");
//         return;
//     }

//     rez=sass.compile(caleScss, {"sourceMap":true});
//     fs.writeFileSync(caleCss,rez.css)
    
// }


// function compileazaScss(caleScss, caleCss){
//     if(!caleCss){
//         let numeFisExt = path.basename(caleScss);
//         let numeFis = numeFisExt.split(".")[0];
//         caleCss = numeFis + ".css";
//     }

//     if (!path.isAbsolute(caleScss))
//         caleScss = path.join(obGlobal.folderScss, caleScss);
//     if (!path.isAbsolute(caleCss))
//         caleCss = path.join(obGlobal.folderCss, caleCss);

//     let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
//     if (!fs.existsSync(caleBackup)) {
//         fs.mkdirSync(caleBackup, {recursive:true});
//     }

//     let numeFisCss = path.basename(caleCss);

//     if (fs.existsSync(caleCss)){
//         let nume = numeFisCss.split(".")[0];
//         let ext = numeFisCss.split(".")[1];
//         let timestamp = Date.now();
//         let numeBackup = `${nume}_${timestamp}.${ext}`;
//         fs.copyFileSync(caleCss, path.join(caleBackup, numeBackup));
//     }

//     if (!sass) {
//         console.warn("SCSS compilation skipped: modul sass nu este disponibil.");
//         return;
//     }

//     let rez = sass.compile(caleScss, {sourceMap:true});
//     fs.writeFileSync(caleCss, rez.css);
// }


function compileazaScss(caleScss, caleCss){
    let info = path.parse(caleScss);
    let numeFis = info.name;

    if(!caleCss){
        caleCss = numeFis + ".css";
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, {recursive:true});
    }

    let infoCss = path.parse(caleCss);

    if (fs.existsSync(caleCss)){
        let timestamp = Date.now();
        let numeBackup = `${infoCss.name}_${timestamp}${infoCss.ext}`;
        fs.copyFileSync(caleCss, path.join(caleBackup, numeBackup));
    }

    if (!sass) {
        console.warn("SCSS compilation skipped: modul sass nu este disponibil.");
        return;
    }

    let rez = sass.compile(caleScss, {sourceMap:true});
    fs.writeFileSync(caleCss, rez.css);
}

// exemplu pentru ce returneaza path.parse
// {
//   root: '',
//   dir: '',
//   base: 'stil.frumos.dark.scss',
//   ext: '.scss',
//   name: 'stil.frumos.dark'
// }




//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})



// VERIFICARE GALERIE.JSON
function verificaGalerieJSON() {
    const caleFisier = path.join(__dirname, "resurse/json/galerie.json");

    if (!fs.existsSync(caleFisier)) {
        console.error("[EROARE CRITICĂ] Fișierul galerie.json NU există!");
        return;
    }

    let continutBrut = fs.readFileSync(caleFisier, "utf-8");
    let galerie;

    try {
        galerie = JSON.parse(continutBrut);
    } catch (err) {
        console.error("[EROARE] JSON invalid în galerie.json:", err.message);
        return;
    }

    const caleGalerieAbs = path.join(__dirname, galerie.cale_galerie || "");

    if (!fs.existsSync(caleGalerieAbs)) {
        console.error(`[EROARE] Folderul specificat în "cale_galerie" NU există: ${caleGalerieAbs}`);
    }

    for (let img of galerie.imagini) {
        const caleImgAbs = path.join(caleGalerieAbs, img.fisier);

        if (!fs.existsSync(caleImgAbs)) {
            console.error(`[EROARE] Fișierul imagine NU există: ${caleImgAbs}`);
        }
    }

    console.log("[OK] Verificarea galerie.json s-a încheiat.");
}
verificaGalerieJSON();

// IMAGINI
function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleGalerie=obGlobal.obImagini.cale_galerie;

    let caleAbs=path.join(__dirname,caleGalerie);
    let caleAbsMediu=path.join(caleAbs, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split("."); //"ceva.png" -> ["ceva", "png"]
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", caleGalerie, "mediu", numeFis+".webp" )
        imag.fisier=path.join("/", caleGalerie, imag.fisier )
        
    }
    // console.log(obGlobal.obImagini)
}
initImagini();




// PENTRU ID
app.use(function(req, res, next){
    res.locals.ip = req.ip;
    next();
});



// GETTURILE
app.get(["/", "/index", "/home"], function(req, res){
    try {
        const azi = new Date();
        const zile = ["duminica", "luni", "marti", "miercuri", "joi", "vineri", "sambata"];
        const ziCurenta = zile[azi.getDay()]; // ex: "joi"

        function ziInInterval(zi, interval) {
            const [start, end] = interval;
            const idxStart = zile.indexOf(start);
            const idxEnd = zile.indexOf(end);
            const idxZi = zile.indexOf(zi);

            if (idxStart <= idxEnd) {
                // interval normal: luni–miercuri
                return idxZi >= idxStart && idxZi <= idxEnd;
            } else {
                // interval care trece peste duminică: vineri–marti
                return idxZi >= idxStart || idxZi <= idxEnd;
            }
        }

        const imaginiFiltrate = obGlobal.obImagini.imagini.filter(img => {
            // img.intervale_zile este o LISTĂ de intervale
            return img.intervale_zile.some(interval => ziInInterval(ziCurenta, interval));
        });

        res.render("pagini/index", {
            imagini: imaginiFiltrate,
            caleGalerie: obGlobal.obImagini.cale_galerie
        });

    } catch (err) {
        console.error("Eroare la render galerie:", err);
        afisareEroare(res, 500, "Eroare la încărcarea galeriei", "A apărut o problemă la afișarea paginii galeriei.");
    }
});

app.get("/galerie", function(req, res){
    try {
        const azi = new Date();
        const zile = ["duminica", "luni", "marti", "miercuri", "joi", "vineri", "sambata"];
        const ziCurenta = zile[azi.getDay()]; // ex: "joi"

        function ziInInterval(zi, interval) {
            const [start, end] = interval;
            const idxStart = zile.indexOf(start);
            const idxEnd = zile.indexOf(end);
            const idxZi = zile.indexOf(zi);

            if (idxStart <= idxEnd) {
                // interval normal: luni–miercuri
                return idxZi >= idxStart && idxZi <= idxEnd;
            } else {
                // interval care trece peste duminică: vineri–marti
                return idxZi >= idxStart || idxZi <= idxEnd;
            }
        }

        let imaginiFiltrate = obGlobal.obImagini.imagini.filter(img => {
            // img.intervale_zile este o LISTĂ de intervale
            return img.intervale_zile.some(interval => ziInInterval(ziCurenta, interval));
        });

        // TRUNCHIEREA LA CEL MAI MIC NUMĂR PAR
        if (imaginiFiltrate.length % 2 === 1) {
            imaginiFiltrate.pop();
        }

        res.render("pagini/galerie", {
            imagini: imaginiFiltrate,
            caleGalerie: obGlobal.obImagini.cale_galerie
        });

    } catch (err) {
        console.error("Eroare la render galerie:", err);
        afisareEroare(res, 500, "Eroare la încărcarea galeriei", "A apărut o problemă la afișarea paginii galeriei.");
    }
});

app.get("/galerie-animata", function (req, res) {
    try {
        const toateImaginile = obGlobal.obImagini.imagini;

        function numarImparRandom(min, max) {
            const impari = [];
            for (let i = min; i <= max; i++) {
                if (i % 2 === 1) impari.push(i);
            }
            return impari[Math.floor(Math.random() * impari.length)];
        }

        const n = numarImparRandom(5, 11);

        const imaginiSelectate = toateImaginile.slice(-n);

        res.render("pagini/galerie-animata", {
            imagini: imaginiSelectate,
            caleGalerie: obGlobal.obImagini.cale_galerie
        });

    } catch (err) {
        console.error("Eroare la galerie animată:", err);
        afisareEroare(res, 500, "Eroare la galeria animată", "A apărut o problemă la afișarea galeriei animate.");
    }
});

app.get("/produse", function(req, res){
    let clauzaWhere = "";
    if (req.query.tip){
        clauzaWhere = ` where tip_articol='${req.query.tip}'`;
    }

    client.query(`select * from articole ${clauzaWhere}`, function(err, rez){
        if (err){
            console.log("Eroare la interogare", err);
            afisareEroare(res, 2, "Eroare la încărcarea produselor", "A apărut o problemă la afișarea paginii produselor.");
        } else {
            console.log("Rezultat interogare", rez);

            // AICI: interogarea cu UNNEST pentru categorii
            client.query(`
                SELECT unnest(enum_range(NULL::categ_articol)) AS categorie
            `, function(err2, rez2) {

                if (err2) {
                    console.log("Eroare la unnest", err2);
                    afisareEroare(res, 2, "Eroare la încărcarea categoriilor", "A apărut o problemă la încărcarea categoriilor.");
                } else {
                    res.render("pagini/produse", {
                        articole: rez.rows,
                        optiuni: rez2.rows
                    });
                }
            });
        }
    });
});


app.get("/produs/:id", function(req, res){
    client.query(`select * from articole where id=${req.params.id}`, function(err, rez){
        if (err){
            console.log("Eroare la interogare", err);
            afisareEroare(res, 2, "Eroare la încărcarea produselor", "A apărut o problemă la afișarea paginii produselor.");
        } else {
            if(rez.rowCount==0){
                afisareEroare(res, 404, "Produs inexistent", "Produsul cu ID-ul specificat nu a fost găsit.");
                return;
            }
            else {
                console.log("Rezultat interogare", rez);
                res.render("pagini/produs", {
                    prod: rez.rows[0]
                });
            }
        }
})});

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname,"resurse/imagini/favicon/favicon.ico"))
});

app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);

    if (req.url.startsWith("/resurse") && path.extname(req.url)==""){
        afisareEroare(res,403);
        return;
    }
    if (path.extname(req.url)==".ejs"){
        afisareEroare(res,400);
        return;
    }
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if (err){
                if (err.message.includes("Failed to lookup view")){
                    afisareEroare(res,404)
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if (err.message.includes("Cannot find module")){
            afisareEroare(res,404)
        }
        else{
            afisareEroare(res);
        }
    }
});

app.use((req, res) => {
    afisareEroare(res, 404);
});

app.use((err, req, res, next) => {
    console.error('Eroare internă', err);
    afisareEroare(res, 500, '500 - Eroare internă', 'Ceva nu a mers bine pe server. Încearcă din nou mai târziu.');
});




app.listen(8080);
console.log("Serverul a pornit!");


