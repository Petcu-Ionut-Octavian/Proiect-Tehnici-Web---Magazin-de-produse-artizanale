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

        // categorie simplă (nu multiple)
        let categorieSelectata = document.getElementById("inp-categorie").value.toLowerCase();

        // materiale multiple
        let selMat = document.getElementById("inp-materiale");
        let materialeSelectate = Array.from(selMat.selectedOptions).map(opt => opt.value.toLowerCase());

        let ecologicSelectat = document.querySelector("input[name='gr_ecologic']:checked").value;

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {

            prod.style.display = "none";

            let numeProd = prod.getElementsByClassName("val-nume")[0].innerText.trim().toLowerCase();
            let pretProd = parseFloat(prod.getElementsByClassName("val-pret")[0].innerText.trim());
            let categorieProd = prod.getElementsByClassName("categorie")[0].innerText.trim().toLowerCase();
            let ecologicProd = prod.getElementsByClassName("ecologic")[0].innerText.trim().toLowerCase();

            // --- MATERIALS: transformăm {lemn,vopsea,lac} în array JS ---
            let materialeProd = prod.getElementsByClassName("materiale")[0].innerText
                .replace(/[{}]/g, "")        // scoate acoladele
                .split(",")                  // sparge în array
                .map(m => m.trim().toLowerCase())
                .filter(m => m.length > 0);  // elimină golurile

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
                materialeSelectate.every(mat => materialeProd.includes(mat));

            // ---------------- AFIȘARE ----------------

            if (condNume && condPret && condCategorie && condEcologic && condMateriale) {
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


    function sorteaza(semn){
        let produse=document.getElementsByClassName("produs")
        let vProduse= Array.from(produse)
        vProduse.sort(function(a,b){
            let pretA=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let pretB=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
            if (pretA==pretB){
                let numeA=a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                let numeB=b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                return (numeA.localeCompare(numeB))*semn
            }
            return (pretA-pretB)*semn
        })
        for (let prod of vProduse){
            prod.parentNode.appendChild(prod)
        }
    }

    document.getElementById("sortCrescNume").onclick = () => sorteaza(1)
    document.getElementById("sortDescrescNume").onclick = () => sorteaza(-1)


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
