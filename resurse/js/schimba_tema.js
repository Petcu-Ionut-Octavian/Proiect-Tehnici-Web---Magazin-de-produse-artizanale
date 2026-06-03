window.addEventListener("DOMContentLoaded", function() {

    let radiosTema = document.querySelectorAll("input[name='gr_tema']");
    let switchDark = document.getElementById("schimba_tema");
    let icon = document.getElementById("icon-tema");

// -------------------------
// 1. RESTAURARE TEMA (radio + switch)
// -------------------------
let temaSalvata = localStorage.getItem("tema-multipla");

if (!temaSalvata || temaSalvata === "light") {

    switchDark.checked = false;
    
    let radio = document.getElementById("tema-light");
    if (radio) radio.checked = true;

    icon.classList.replace("fa-moon", "fa-sun");

} else {

    if (temaSalvata === "dark") {
        switchDark.checked = true;
        icon.classList.replace("fa-sun", "fa-moon");
    } else {
        switchDark.checked = false;
        icon.classList.replace("fa-moon", "fa-sun");
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
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            } else if (this.value !== "light") {
                document.body.classList.add(this.value);
                switchDark.checked = false;
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            } else {
                switchDark.checked = false;
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
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
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        } else {
            document.getElementById("tema-light").checked = true;
            localStorage.setItem("tema-multipla", "light");
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    });

});
