window.addEventListener("DOMContentLoaded", function() {

    let radiosTema = document.querySelectorAll("input[name='gr_tema']");
    let switchDark = document.getElementById("schimba_tema");

// -------------------------
// 1. RESTAURARE TEMA (radio + switch)
// -------------------------
let temaSalvata = localStorage.getItem("tema-multipla");

if (!temaSalvata || temaSalvata === "light") {

    switchDark.checked = false;
    
    let radio = document.getElementById("tema-light");
    if (radio) radio.checked = true;

} else {

    if (temaSalvata === "dark") {
        switchDark.checked = true;
    } else {
        switchDark.checked = false;
    }

    let radio = document.getElementById("tema-" + temaSalvata);
    if (radio) radio.checked = true;
}


    // -------------------------
    // 2. RADIO BUTTONS
    // -------------------------
    radiosTema.forEach(r => {
        r.addEventListener("change", function() {

            document.body.classList.remove("dark", "tema1", "tema2", "tema3");

            if (this.value === "dark") {
                document.body.classList.add("dark");
                switchDark.checked = true;
            } else if (this.value !== "light") {
                document.body.classList.add(this.value);
                switchDark.checked = false;
            } else {
                switchDark.checked = false;
            }

            localStorage.setItem("tema-multipla", this.value);
        });
    });

    // -------------------------
    // 3. SWITCH DARK
    // -------------------------
    switchDark.addEventListener("change", function() {
        document.body.classList.remove("dark", "tema1", "tema2", "tema3");

        if (this.checked) {
            document.body.classList.add("dark");
            document.getElementById("tema-dark").checked = true;
            localStorage.setItem("tema-multipla", "dark");
        } else {
            document.getElementById("tema-light").checked = true;
            localStorage.setItem("tema-multipla", "light");
        }
    });

});
