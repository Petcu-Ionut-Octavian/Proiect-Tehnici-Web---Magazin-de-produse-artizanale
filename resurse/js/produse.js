const K = 6;

let produseVizibile = [];

function genereazaPaginare() {
    let N = produseVizibile.length;
    let NRL = Math.ceil(N / K);

    let container = document.getElementById("paginare");
    container.innerHTML = "";

    if (NRL < 1) return;

    for (let p = 1; p <= NRL; p++) {
        let btn = document.createElement("button");
        btn.textContent = p;
        btn.className = "btn btn-outline-primary m-1";

        btn.onclick = function() {
            afiseazaPagina(p);
        };

        container.appendChild(btn);
    }

    afiseazaPagina(1);
}

function afiseazaPagina(p) {
    // ascundem toate produsele vizibile
    produseVizibile.forEach(pr => pr.style.display = "none");

    let start = (p - 1) * K;
    let end = p * K;

    for (let i = start; i < end && i < produseVizibile.length; i++) {
        produseVizibile[i].style.display = "block";
    }
}


function filtreaza() {
    let textCautat = document.getElementById("inp-nume").value.toLowerCase();
    let pretMinim = parseFloat(document.getElementById("inp-pret").value);

    let categorieSelectata = document.getElementById("inp-categorie").value.toLowerCase();

    // materiale multiple
    let selMat = document.getElementById("inp-materiale");
    let materialeSelectate = Array.from(selMat.selectedOptions).map(opt => opt.value.toLowerCase());

    // datalist (data)
    let dataSelectata = document.getElementById("inp-data-datalist").value.trim();

    // ecologic
    let ecologicSelectat = document.querySelector("input[name='gr_ecologic']:checked").value;

    // greutate (checkbox group)
    let greutatiSelectate = Array.from(document.querySelectorAll(".chk-greutate:checked"))
                                    .map(c => c.value);

    // keywords (textarea)
    let keywords = document.getElementById("inp-keywords").value
                    .toLowerCase()
                    .split(",")
                    .map(k => k.trim())
                    .filter(k => k.length > 0);

    // ---------------- VALIDARE INPUTURI ----------------

    // text căutat (string garantat, dar verificăm existența inputului)
    if (
        typeof textCautat !== "string" ||
        /[.,\/\\!@#$%^&*()+=<>?;:"{}~`]/.test(textCautat)
    ) {
        alert("Eroare: textul căutat este invalid.");
        return;
    }


    // preț minim
    if (isNaN(pretMinim) || pretMinim < 0) {
        alert("Eroare: prețul minim este invalid.");
        return;
    }

    // categorie selectată
    const categoriiValide = [
        "toate",
        "comun",
        "cadou",
        "editie limitata",
        "decoratiune",
        "pentru copii",
        "comanda speciala"
    ];
    if (!categoriiValide.includes(categorieSelectata)) {
        alert("Eroare: categoria selectată este invalidă.");
        return;
    }

    // materiale selectate
    let materialeValide = Array.from(document.querySelectorAll("#inp-materiale option"))
                            .map(opt => opt.value.toLowerCase());

    if (materialeSelectate.length === 0) {
        alert("Selectați cel puțin un material.");
        return;
    }

    for (let m of materialeSelectate) {
        if (!materialeValide.includes(m)) {
            alert("Eroare: material selectat invalid.");
            return;
        }
    }

    // dată (datalist) – permisă goală sau format YYYY-MM-DD
    if (dataSelectata !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dataSelectata)) {
        alert("Eroare: data introdusă este invalidă.");
        return;
    }

    // ecologic
    if (!["toate", "true", "false"].includes(ecologicSelectat)) {
        alert("Eroare: opțiunea ecologică selectată este invalidă.");
        return;
    }

    // greutăți
    const greutatiValide = ["usor", "mediu", "greu"];

    if (greutatiSelectate.length === 0) {
        alert("Selectați cel puțin o categorie de greutate.");
        return;
    }

    for (let g of greutatiSelectate) {
        if (!greutatiValide.includes(g)) {
            alert("Eroare: opțiune de greutate invalidă.");
            return;
        }
    }

    // keywords — verificăm fiecare keyword pentru caractere interzise
    if (keywords.some(k => /[!@#$%^&*\/\\]/.test(k))) {
        alert("Eroare: lista de cuvinte cheie conține caractere interzise.");
        return;
    }


    let produse = document.getElementsByClassName("produs");
    let nrAfisate = 0;
    produseVizibile = []; // resetăm vectorul
    for (let prod of produse) {

        prod.style.display = "none";

        let numeProd = prod.getElementsByClassName("val-nume")[0].innerText.trim().toLowerCase();
        let pretProd = parseFloat(prod.getElementsByClassName("val-pret")[0].innerText.trim());
        let categorieProd = prod.getElementsByClassName("categorie")[0].innerText.trim().toLowerCase();
        let ecologicProd = prod.getElementsByClassName("ecologic")[0].innerText.trim().toLowerCase();

        // materiale produs
        let materialeProd = prod.getElementsByClassName("materiale")[0].innerText
            .replace(/[{}]/g, "")
            .split(",")
            .map(m => m.trim().toLowerCase())
            .filter(m => m.length > 0);

        // data produs
        let dataProd = prod.getElementsByClassName("val-data")[0]
                            .querySelector("time")
                            .getAttribute("datetime")
                            .slice(0,10);

        // greutate produs
        let greutateProd = parseInt(prod.getElementsByClassName("greutate")[0].innerText);

        let categorieGreutate =
            greutateProd < 100 ? "usor" :
            greutateProd < 300 ? "mediu" :
                                    "greu";

        // descriere + keywords
        let descriereProd = prod.getElementsByClassName("descriere")[0].innerText.toLowerCase();

        let condKeywords =
            keywords.length === 0 ||
            keywords.some(k => descriereProd.includes(k));

        // ---------------- CONDIȚII ----------------

        let condNume = numeProd.includes(textCautat);

        let condPret = pretProd >= pretMinim;

        let condCategorie =
            (categorieSelectata === "toate") ||
            (categorieProd === categorieSelectata);

        let condEcologic =
            (ecologicSelectat === "toate") ||
            (ecologicProd === ecologicSelectat);

        let condMateriale =
            materialeSelectate.includes("toate") ||
            materialeSelectate.some(mat => materialeProd.includes(mat));

        let condData =
            (dataSelectata === "") ||
            (dataProd === dataSelectata);

        let condGreutate =
            greutatiSelectate.includes(categorieGreutate);

        // ---------------- AFIȘARE ----------------
        if (condNume && condPret && condCategorie && condEcologic &&
            condMateriale && condData && condGreutate && condKeywords) {
            prod.style.display = "block";
            nrAfisate++;
            produseVizibile.push(prod);
        }
    }

    let msg = document.getElementById("mesaj-filtrare");
    msg.style.display = (nrAfisate === 0 ? "block" : "none");
    document.getElementById("nr-produse").textContent = `(${nrAfisate})`;
    genereazaPaginare();
};

window.onload = function() {
    // ----------------- PAGINARE ----------------
    // toate produsele din pagină
    let toateProdusele = Array.from(document.getElementsByClassName("produs"));

    // vectorul vizibil = toate produsele la început
    produseVizibile = [...toateProdusele];

    genereazaPaginare();

    // ---------------- RANGE INFO ----------------
    let range = document.getElementById("inp-pret");
    let info = document.getElementById("infoRange");
    info.innerText = `(${range.value})`;

    range.oninput = function() {
        info.innerText = `(${this.value})`;
    };


    // ---------------- FILTRARE ----------------
    document.getElementById("filtrare").onclick = filtreaza;


    // ---------------- RESETARE ----------------
    document.getElementById("resetare").onclick = function () {

        // Confirmare cerută în enunț
        if (!confirm("Sigur doriți să resetați toate filtrele?")) {
            return;
        }

        // ---------------- RESETARE INPUTURI ----------------

        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-pret").value = 0;
        document.getElementById("inp-categorie").value = "toate";

        // materiale multiple
        let selMat = document.getElementById("inp-materiale");
        for (let opt of selMat.options) opt.selected = false;
        if (selMat.querySelector("option[value='toate']"))
            selMat.querySelector("option[value='toate']").selected = true;

        // datalist
        document.getElementById("inp-data-datalist").value = "";

        // ecologic
        document.querySelector("input[name='gr_ecologic'][value='toate']").checked = true;

        // greutăți
        document.querySelectorAll(".chk-greutate").forEach(chk => chk.checked = true);

        // keywords
        document.getElementById("inp-keywords").value = "";

        // ---------------- REAFIȘARE PRODUSE ----------------

        let produse = Array.from(document.getElementsByClassName("produs"));

        let msg = document.getElementById("mesaj-filtrare");
        msg.style.display = "none";

        document.getElementById("nr-produse").textContent = ``;

        // ---------------- RESETARE ORDINE INIȚIALĂ ----------------

        let container = document.querySelector(".grid-produse");

        produse.sort((a, b) => {
            return parseInt(a.dataset.index) - parseInt(b.dataset.index);
        });

        produse.forEach(p => container.appendChild(p));

        // toate produsele din pagină
        let toateProdusele = Array.from(document.getElementsByClassName("produs"));

        // vectorul vizibil = toate produsele la început
        produseVizibile = [...toateProdusele];
        genereazaPaginare();
    };



    // ---------------- SORTARE ----------------
    function sorteaza(semn){
        // sortăm DOAR produsele vizibile (cele filtrate)
        produseVizibile.sort(function(a,b){
            let pretA = parseFloat(a.querySelector(".val-pret").innerText);
            let pretB = parseFloat(b.querySelector(".val-pret").innerText);

            if(pretA === pretB){
                let matA = a.querySelector(".materiale").innerText.replace(/[{}]/g,"").split(",").length;
                let matB = b.querySelector(".materiale").innerText.replace(/[{}]/g,"").split(",").length;
                return (matA - matB) * semn;
            }

            return (pretA - pretB) * semn;
        });

        // reafișăm produsele sortate în container
        let container = document.querySelector(".grid-produse");
        produseVizibile.forEach(p => container.appendChild(p));

        // regenerăm paginarea după sortare
        genereazaPaginare();
    }


    document.getElementById("sortCresc").onclick = () => sorteaza(1);
    document.getElementById("sortDesc").onclick = () => sorteaza(-1);

    function afiseazaSuma(suma) {
        let p = document.getElementById("infoSuma");

        if (!p) {
            p = document.createElement("p");
            p.id = "infoSuma";
            p.innerHTML = `Suma produselor vizibile este: ${suma.toFixed(2)}`;

            let sectiuneProduse = document.getElementById("produse");
            sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse);

            setTimeout(() => {
                let p1 = document.getElementById("infoSuma");
                if (p1) p1.remove();
            }, 2000);
        } else {
            p.innerHTML = `Suma produselor vizibile este: ${suma.toFixed(2)}`;
        }
    }


    document.getElementById("calculeaza").onclick = function() {
        let suma = 0;

        for (let prod of produseVizibile) {
            let pret = parseFloat(prod.querySelector(".val-pret").innerText.trim());
            suma += pret;
        }

        afiseazaSuma(suma);
    };




    // ---------------- SUMA PREȚURI (ALT + C) ----------------
    window.onkeydown = function(e) {
        if (e.key == "c" && e.altKey) {
            let suma = 0;

            for (let prod of produseVizibile) {
                let pret = parseFloat(prod.querySelector(".val-pret").innerText.trim());
                suma += pret;
            }

            afiseazaSuma(suma);
        }
    };


    window.addEventListener("input", function() {
        let textarea = document.getElementById("inp-keywords");
        let raw = textarea.value.trim();

        // dacă conține caractere interzise → invalid
        if (/[!@#$%^&*\/\\]/.test(raw)) {
            textarea.classList.add("is-invalid");
        } else {
            textarea.classList.remove("is-invalid");
        }
    });


};
