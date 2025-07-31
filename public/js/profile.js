import { showMessage , apiRequest , toggleMenu , toggleTutorial } from "./utils.js";

// função para mostrar o perfil do usuário
async function showProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        alert("Você precisa estar logado para acessar esta página.");
        logout();
        return;
    }
    try {
        // Exibe as informações do usuário
        document.getElementById("userId").innerText = user.id;
        document.getElementById("userName").innerText = user.name;
        document.getElementById("userEmail").innerText = user.email;
        document.getElementById("currentPhase").innerText = user.current_phase;
        document.getElementById("currentEnergy").innerText = user.energy + " / 5";

    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        alert("Erro ao carregar o perfil. Faça login novamente.");
        logout();
    }
}

// Alterar informações do usuário no banco de dados
window.updateUserInfos = async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const newName = document.getElementById("newName").value;
    const newEmail = document.getElementById("newEmail").value;
    const updatedData = {};
    if (newName){updatedData.name = newName;} else {
        updatedData.name=user.name;
    }
    if (newEmail) {updatedData.email = newEmail;} else {
        updatedData.email=user.email;
    }

    if (Object.keys(updatedData).length === 0) {
        alert("Nenhum campo foi preenchido.");
        return;
    }
    const response = await apiRequest("/user/update-info", "PUT", updatedData);
    if (response.message === "Informações atualizadas com sucesso!") {
        localStorage.removeItem("user");
        localStorage.setItem("user", '{"id":'+user.id+',"name":"'+updatedData.name+'","email":"'+updatedData.email+'","current_phase":'+user.current_phase+'}');
        showMessage("SUCESSO!",response.message,["profile.html","OK"]);
    } else {
        showMessage("ERRO!",response.message,["profile.html","OK"]);
    }
}

window.logout = function (){
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Menu hamburger
window.toggleMenu = toggleMenu;

// Tutorial da pagina
window.toggleTutorial = toggleTutorial;

// Chama a função ao carregar a página
window.onload = showProfile;