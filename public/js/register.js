import { closePopup , apiRequest , showMessage , toggleMenu } from "./utils.js";

// Menu hamburger
window.toggleMenu = toggleMenu;

// Fecha o popup
window.closePopup = closePopup;

// Formulario de registro
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        showMessage("ERRO!", "Todos os campos são obrigatórios.", ["closePopup()", "OK"]);
    }
    
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        showMessage("ERRO!","A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um caractere especial.",["closePopup()","Tentar novamente"]);
    }
    else {
        try {
            const response = await apiRequest("/auth/register", "POST", { name, email, password });
            if (response.error){
                showMessage("OPS!", response.message,["closePopup()", "Tentar novamente"]);
            } else {
                showMessage("OK!", response.message,["window.location.href='login.html'","Fazer login"]);
            }
        } catch (error){
            showMessage("OPS!", error,["closePopup()", "Tentar novamente"]);
        };
    }
});