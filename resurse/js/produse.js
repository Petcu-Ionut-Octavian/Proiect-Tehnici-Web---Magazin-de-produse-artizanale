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

        let inpNume = document.getElementById("inp-nume").value.toLowerCase();
        let inpPret = parseFloat(document.getElementById("inp-pret").value);
        let inpTip = document.getElementById("inp-tip").value;

        let selCategorii = document.getElementById("inp-categorie");
        let categoriiSelectate = Array.from(selCategorii.selectedOptions).map(opt => opt.value);

        let inpEcologic = document.querySelector("input[name='gr_ecologic']:checked").value;

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {

            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerText.trim().toLowerCase();
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerText.trim());
            let tip = prod.getElementsByClassName("tip")[0].innerText.trim().toLowerCase();
            let categorie = prod.getElementsByClassName("categorie")[0].innerText.trim().toLowerCase();
            let ecologic = prod.getElementsByClassName("ecologic")[0].innerText.trim().toLowerCase();

            let cond1 = nume.includes(inpNume);
            let cond2 = pret >= inpPret;
            let cond3 = (inpTip === "toate") || (tip === inpTip);
            let cond4 = (categoriiSelectate.includes("toate")) || (categoriiSelectate.includes(categorie));
            let cond5 = (inpEcologic === "toate") || (ecologic === inpEcologic);

            if (cond1 && cond2 && cond3 && cond4 && cond5) {
                prod.style.display = "block";
            }
        }
    };


    // ---------------- RESETARE ----------------
    document.getElementById("resetare").onclick = function() {

        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-pret").value = 0;
        document.getElementById("infoRange").innerText = "(0)";
        document.getElementById("inp-tip").value = "toate";

        let selCategorii = document.getElementById("inp-categorie");
        for (let opt of selCategorii.options) {
            opt.selected = (opt.value === "toate");
        }

        document.querySelector("input[name='gr_ecologic'][value='toate']").checked = true;

        let produse = document.getElementsByClassName("produs");
        for (let prod of produse) {
            prod.style.display = "block";
        }
    };


    // ---------------- SORTARE CRESCĂTOARE ----------------
    document.getElementById("sortCrescNume").onclick = function() {

        let container = document.querySelector(".grid-produse");
        let produse = Array.from(container.getElementsByClassName("produs"));

        produse.sort(function(a, b) {
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerText);
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerText);

            if (pretA === pretB) {
                let numeA = a.getElementsByClassName("val-nume")[0].innerText.toLowerCase();
                let numeB = b.getElementsByClassName("val-nume")[0].innerText.toLowerCase();
                return numeA.localeCompare(numeB);
            }

            return pretA - pretB;
        });

        for (let p of produse) container.appendChild(p);
    };


    // ---------------- SORTARE DESCRESCĂTOARE ----------------
    document.getElementById("sortDescrescNume").onclick = function() {

        let container = document.querySelector(".grid-produse");
        let produse = Array.from(container.getElementsByClassName("produs"));

        produse.sort(function(a, b) {
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerText);
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerText);

            if (pretA === pretB) {
                let numeA = a.getElementsByClassName("val-nume")[0].innerText.toLowerCase();
                let numeB = b.getElementsByClassName("val-nume")[0].innerText.toLowerCase();
                return numeB.localeCompare(numeA);
            }

            return pretB - pretA;
        });

        for (let p of produse) container.appendChild(p);
    };


    // ---------------- SUMA PREȚURI (ALT + C) ----------------
    document.addEventListener("keydown", function(e) {
        if (e.altKey && e.key.toLowerCase() === "c") {

            let produse = document.getElementsByClassName("produs");
            let suma = 0;

            for (let prod of produse) {
                if (prod.style.display !== "none") {
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerText);
                    suma += pret;
                }
            }

            document.getElementById("p-suma").innerText =
                "Suma prețurilor produselor afișate: " + suma + " lei";
        }
    });

};
