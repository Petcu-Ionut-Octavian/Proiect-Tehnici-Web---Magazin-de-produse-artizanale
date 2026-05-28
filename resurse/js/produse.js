window.onload = function() {

    // ---------------- RANGE INFO ----------------
    let range = document.getElementById("inp-pret");
    let info = document.getElementById("infoRange");
    info.innerText = `(${range.value})`;

    range.oninput = function() {
        info.innerText = `(${this.value})`;
    };


    // ---------------- FILTRARE ----------------
    document.getElementById("filtrare").onclick = function() {

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

        // keywords — trebuie să fie array (este garantat, dar verificăm)
        if (!Array.isArray(keywords)) {
            alert("Eroare: lista de cuvinte cheie este invalidă.");
            return;
        }

        let produse = document.getElementsByClassName("produs");
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
            }
        }
    };


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
        produse.forEach(p => p.style.display = "block");

        // ---------------- RESETARE ORDINE INIȚIALĂ ----------------

        let container = document.querySelector(".grid-produse");

        produse.sort((a, b) => {
            return parseInt(a.dataset.index) - parseInt(b.dataset.index);
        });

        produse.forEach(p => container.appendChild(p));
    };



    // ---------------- SORTARE ----------------
    function sorteaza(semn){
        let produse = Array.from(document.getElementsByClassName("produs"));

        produse.sort(function(a,b){
            let pretA = parseFloat(a.querySelector(".val-pret").innerText);
            let pretB = parseFloat(b.querySelector(".val-pret").innerText);

            if(pretA === pretB){
                let matA = a.querySelector(".materiale").innerText.replace(/[{}]/g,"").split(",").length;
                let matB = b.querySelector(".materiale").innerText.replace(/[{}]/g,"").split(",").length;
                return (matA - matB) * semn;
            }

            return (pretA - pretB) * semn;
        });

        let container = document.querySelector(".grid-produse");
        produse.forEach(p => container.appendChild(p));
    }

    document.getElementById("sortCresc").onclick = () => sorteaza(1);
    document.getElementById("sortDesc").onclick = () => sorteaza(-1);

    document.getElementById("calculeaza").onclick = function() {
        let produse = document.getElementsByClassName("produs");
        let suma = 0;

        for (let prod of produse) {
            if (prod.style.display != "none") {
                let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
                suma += pret;
            }
        }

        let p = document.getElementById("infoSuma");
        if (!p) {
            p = document.createElement("p");
            p.innerHTML = `Suma produselor vizibile este: ${suma.toFixed(2)}`;
            p.id = "infoSuma";

            let sectiuneProduse = document.getElementById("produse");
            sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse);

            setTimeout(function() {
                let p1 = document.getElementById("infoSuma");
                if (p1) p1.remove();
            }, 2000);
        } else {
            p.innerHTML = `Suma produselor vizibile este: ${suma.toFixed(2)}`;
        }
    };



    // ---------------- SUMA PREȚURI (ALT + C) ----------------
    window.onkeydown=function(e){
        if (e.key=="c" && e.altKey){
            let produse = document.getElementsByClassName("produs")
            let suma = 0
            for (let prod of produse){
                if (prod.style.display != "none"){
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                    suma += pret
                }
            }
            let p = document.getElementById("infoSuma")
            if(!p){
                let p = document.createElement("p")
                p.innerHTML = `Suma produselor vizibile este: ${suma.toFixed(2)}`
                p.id = "infoSuma"
                let sectiuneProduse = document.getElementById("produse")
                sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse)
                this.setTimeout(function(){
                    let p1 = this.document.getElementById("infoSuma")
                    p1.remove()
                }, 2000)        
            }
            else{
                p.innerHTML = `Suma produselor vizibile este: ${suma.toFixed(2)}`
            }
        }
    }

};
