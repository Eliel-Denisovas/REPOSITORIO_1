/* Dark Mode */
.dark-mode {
    background: #333;
    color: white;
}

/* JavaScript (js/script.js) */
document.addEventListener("DOMContentLoaded", function() {
    alert("Página carregada com sucesso!");
    
    document.getElementById("changeText").addEventListener("click", function() {
        this.innerText = "Texto alterado!";
    });
    
    document.getElementById("darkModeToggle").addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
    });
});
