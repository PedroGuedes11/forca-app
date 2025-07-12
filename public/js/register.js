import { apiRequest , showMessage, toggleMenu } from "./utils.js ";

// Menu hamburger
window.toggleMenu = toggleMenu;

// Formulario de registro
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Todos os campos são obrigatórios.");
        return;
    }
    
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        showMessage("ERRO!","A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um caractere especial.",["register.html","OK"]);
        return;
    }
    
    try {
        const response = await apiRequest("/auth/register", "POST", { name, email, password });
        if (response.error){
            showMessage("OPS!", response.message,["register.html","Tentar novamente"]);
        }else {
            showMessage("OK!",response.message,["login.html","Fazer login"]);
        }       
    } catch (error){
        showMessage("OPS!", error,["register.html","Tentar novamente"]);
    };            
});