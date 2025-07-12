import { apiRequest, showMessage, toggleMenu } from "./utils.js";

// Menu hamburger
window.toggleMenu = toggleMenu;

// Formulario de login
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const response = await apiRequest("/auth/login", "POST", { email, password });
    if(!response.error){
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        showMessage("SUCESSO!", response.message, ["phases.html","OK"]);
    } else {
        showMessage("ERRO!", response.message, ["login.html","Tentar novamente"]);
    }
});