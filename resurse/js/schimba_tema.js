window.addEventListener("DOMContentLoaded", function(){
    let sw = document.getElementById("schimba_tema");
    let icon = document.getElementById("icon-tema");

    // restaurare tema
    if (localStorage.getItem("tema")) {
        document.body.classList.add("dark");
        sw.checked = true;
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        document.body.classList.remove("dark");
        sw.checked = false;
        icon.classList.replace("fa-sun", "fa-moon");
    }

    // schimbare tema
    sw.onchange = function(){
        if (sw.checked) {
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
            icon.classList.replace("fa-moon", "fa-sun");
        } else {
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
            icon.classList.replace("fa-sun", "fa-moon");
        }
    }
});
