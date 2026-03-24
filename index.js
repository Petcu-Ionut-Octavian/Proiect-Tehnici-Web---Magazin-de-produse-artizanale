const express= require("express");
const path= require("path");
const fs=require("fs");
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

app.use("/resurse",express.static(path.join(__dirname, "resurse")));


app.get("/", function(req, res){
    try {
        res.render("pagini/index");
    } catch (err) {
        console.error("Eroare la render index:", err);
        afisareEroare(res, 500, "Eroare la încărcarea paginii", "A apărut o problemă la afișarea paginii principale.");
    }
});

app.get("/despre", function(req, res){
    try {
        res.render("pagini/despre");
    } catch (err) {
        console.error("Eroare la render despre:", err);
        afisareEroare(res, 500, "Eroare la încărcarea paginii", "A apărut o problemă la afișarea paginii despre noi.");
    }
});




function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }

}
initErori()



function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }

    if (!sass) {
        console.warn("SCSS compilation skipped: modul sass nu este disponibil.");
        return;
    }

    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}


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

function afisareEroare(res, identificator = 0, titlu, text, imagine){
    let eroareGasita = obGlobal.obErori.info_erori.find(e => e.identificator == identificator);
    let eroare = eroareGasita || obGlobal.obErori.eroare_default;

    const finalTitlu = titlu || eroare.titlu;
    const finalText = text || eroare.text;
    const finalImagine = imagine ? path.join(obGlobal.obErori.cale_baza, imagine) : eroare.imagine;

    const status = (typeof identificator === 'number' && identificator >= 100 && identificator < 600)
        ? identificator
        : (eroareGasita ? eroareGasita.identificator : 500);

    res.status(status).send(`
        <html lang="ro">
            <head><meta charset="utf-8"><title>${finalTitlu}</title></head>
            <body style="font-family: Arial, sans-serif; text-align:center; padding: 2rem;">
                <h1>${finalTitlu}</h1>
                <p>${finalText}</p>
                <p><img src="${finalImagine}" alt="${finalTitlu}" style="max-width:280px; max-height:280px;"></p>
                <p><a href="/">Înapoi la pagina principală</a></p>
            </body>
        </html>
    `);
}

app.use((req, res) => {
    afisareEroare(res, 404);
});

app.use((err, req, res, next) => {
    console.error('Eroare internă', err);
    afisareEroare(res, 500, '500 - Eroare internă', 'Ceva nu a mers bine pe server. Încearcă din nou mai târziu.');
});

app.listen(8080);
console.log("Serverul a pornit!");
