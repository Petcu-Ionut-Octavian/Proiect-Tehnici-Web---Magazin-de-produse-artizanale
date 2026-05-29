(function() {
    let t = localStorage.getItem("tema-multipla");
    if (!t || t === "light") return;

    if (t === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.add(t); // tema1, tema2, tema3
    }
})();
