import { showMessage , closePopup , apiRequest , toggleMenu , toggleTutorial } from "./utils.js";

// função para mostrar o perfil do usuário
async function showProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!(user || token)) {
        showMessage("ERRO!", "Você precisa estar logado para acessar esta página.", ["window.location.href='login.html'", "Login"]);
        return;
    }
    try {
        await getUserInfos();
    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        showMessage("ERRO!", "Erro ao carregar o perfil. Faça login novamente.", ["window.location.href='login.html'", "Login"]);
        return
    }
    console.log("Perfil carregado com sucesso.");
}

//Pega as informações do usuário
async function getUserInfos(){
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("userId").innerText = user.id;
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userEmail").innerText = user.email;
    document.getElementById("currentPhase").innerText = user.current_phase;
    const response = await apiRequest("/user/get-energy", "GET")
    if (!response.error){
        document.getElementById("currentEnergy").innerText = response.current_energy + " / 5";
        if (response.current_energy !== user.current_energy) {
            localStorage.setItem("user", JSON.stringify({
                ...user,
                current_energy: response.current_energy
            }));
        }
    } else{
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        showMessage("ERRO!", response.error, ["window.location.href='login.html'", "Login"]);
    }
    console.log("Informações do usuário recebidas com sucesso.");
}

// Alterar informações do usuário no banco de dados
window.updateUserInfos = async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const newName = document.getElementById("newName").value;
    const newEmail = document.getElementById("newEmail").value;
    const updatedData = {};
    if (!newName && !newEmail){
        showMessage("OPS!","Campos nome e email não podem ser vazios.",["closePopup()","OK"]);
        return;
    }
    else{
        if (newName){updatedData.name = newName;} else {
            updatedData.name=user.name;
        }
        if (newEmail) {updatedData.email = newEmail;} else {
            updatedData.email=user.email;
        }

        if (Object.keys(updatedData).length === 0) {
            showMessage("OPS!","Nenhum campo foi preenchido.",["profile.html","OK"]);
        }
        const response = await apiRequest("/user/update-info", "PUT", updatedData);
        if (response.message === "Informações atualizadas com sucesso!") {
            localStorage.removeItem("user");
            localStorage.setItem("user", '{"id":'+user.id+',"name":"'+updatedData.name+'","email":"'+updatedData.email+'","current_phase":'+user.current_phase+',"current_energy":'+user.current_energy+'}');
            showMessage("SUCESSO!",response.message,["window.location.href='profile.html'","OK"]);
        } else {
            showMessage("ERRO!",response.message,["closePopup()","OK"]);
        }
    }
    console.log("Informações do usuário atualizadas com sucesso.");
}

// Logout
window.logout = function (){
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Menu hamburger
window.toggleMenu = toggleMenu;

// Tutorial da pagina
window.toggleTutorial = toggleTutorial;

// Fecha o popup ao clicar fora dele
window.closePopup = closePopup;

// Chama a função ao carregar a página
window.onload = showProfile;