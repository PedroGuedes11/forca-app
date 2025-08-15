import { apiRequest , showMessage, toggleMenu , toggleTutorial } from "./utils.js";

// Carrega o ranking na tela
async function loadRanking() {
    try {
        const ranking = await apiRequest("/game/ranking", "GET");
        const rankingContainer = document.getElementById("ranking-body");
        rankingContainer.innerHTML = ranking
            .map(
                (player, index) =>
                    `<tr class="ranking-item" style="border: 1px solid black">
                        <td>${index + 1}</td> 
                        <td>${player.name}</td>
                        <td>Fase: ${player.current_phase}</td>
                    </tr>`
            )
            .join("");
    } catch (error) {
        console.error("Erro ao carregar o ranking:", error);
        showMessage("ERRO!", "Erro ao carregar o ranking. Você será redirecionado para a tela de fases.", ["phases.html", "OK"]);
    }
    console.log("Ranking carregado com sucesso.");
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

// Chama a função ao carregar a página
window.onload = loadRanking;