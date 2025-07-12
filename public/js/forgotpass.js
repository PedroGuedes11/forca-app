import { apiRequest , showMessage, toggleMenu } from "./utils.js";

// Menu hamburger
window.toggleMenu = toggleMenu;

// Formulario para recuperaçao da senha
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const response = await apiRequest("/auth/forgot-password", "POST", { email });
    if (response.message==="Instruções enviadas para o email."){
        showMessage("SUCESSO!",response.message,["http://localhost:3000","OK"]);
    }
    else {
        showMessage("ERRO!",response.message,["forgotpass.html","Tentar novamente"]);
    }
});