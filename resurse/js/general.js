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
