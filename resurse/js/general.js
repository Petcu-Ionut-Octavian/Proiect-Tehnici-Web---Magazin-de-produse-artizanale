// general.js

window.addEventListener("DOMContentLoaded", () => {
    console.log("general.js loaded");

    // logica pentru butonul "Citește mai mult"
    const btnCiteste = document.getElementById("btn-citeste-mai-mult");
    if (btnCiteste) {
        btnCiteste.addEventListener("click", () => {
            window.location.href = "/despre";
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const imagini = Array.from(document.querySelectorAll("#galerie-animata .galerie-img"));
    if (imagini.length === 0) return;

    let index = 0;
    let animatieActiva = true;
    let inAnimatie = false;

    function urmatoareaImagine() {
        if (!animatieActiva || inAnimatie) return;

        inAnimatie = true;

        const imgCurenta = imagini[index];
        imgCurenta.classList.add("animatie-clip");

        index = (index + 1) % imagini.length;
        const imgUrmatoare = imagini[index];
        imgUrmatoare.classList.add("activ", "animatie-aparitie");

        imgCurenta.addEventListener("animationend", () => {
            imgCurenta.classList.remove("animatie-clip", "activ");
            imgUrmatoare.classList.remove("animatie-aparitie");
            inAnimatie = false;
        }, { once: true });
    }

    setInterval(() => {
        if (animatieActiva) urmatoareaImagine();
    }, 2600);

    const container = document.querySelector("#galerie-animata .galerie-container");

    container.addEventListener("mouseenter", () => {
        animatieActiva = false;
    });

    container.addEventListener("mouseleave", () => {
        animatieActiva = true;
    });
});