import { apiRequest, showMessage, toggleMenu , toggleTutorial } from "./utils.js";

// Mostrar o perfil do usuário
async function showPhases() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        showMessage("ERRO!", "Você precisa estar logado para acessar esta página.", ["login.html", "OK"]);
        return;
    }
    try {
        await loadPhases(user); // Carrega as fases disponíveis
        await loadUserEnergy(); // Carrega os pontos de energia do usuário
    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        showMessage("ERRO!", "Erro ao carregar o perfil. Faça login novamente.", ["login.html", "OK"]);
        return;
    }
}

// Carrega os pontos de energia do usuário
let energyInterval = null;

async function loadUserEnergy() {
    try {
        const response = await apiRequest(`/user/get-energy`, "GET");
        const energyContainer = document.getElementById("energy-container");
        const energyPoints = document.getElementById("energy-points");
        const currentPoints = response.current_energy;
        const maxPoints = response.max_energy;

        // Atualiza energia
        energyPoints.textContent = `${currentPoints} / ${maxPoints}`;

        // Remove timer antigo se houver
        if (energyInterval) clearInterval(energyInterval);

        // Se energia não está cheia, mostra o tempo para o próximo ponto
        if (response.current_energy < response.max_energy) {
            let secondsLeft = response.secondsToNext;
            const timerSpan = document.getElementById("energy-timer") || document.createElement("span");
            timerSpan.id = "energy-timer";
            energyContainer.appendChild(timerSpan);

            function updateTimer() {
                if (secondsLeft <= 0) {
                    timerSpan.textContent = "Regenerando... (Pode levar alguns segundos)";
                    clearInterval(energyInterval);
                    setTimeout(loadUserEnergy, 15000);
                    return;
                }
                const min = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
                const sec = String(secondsLeft % 60).padStart(2, '0');
                timerSpan.textContent = `Próximo ponto em: ${min}:${sec}`;
                secondsLeft--;
            }

            updateTimer();
            energyInterval = setInterval(updateTimer, 1000);
        } else {
            // Remove o timer se energia estiver cheia
            const timerSpan = document.getElementById("energy-timer");
            if (timerSpan) timerSpan.remove();
        }
    } catch (error) {
        console.error("Erro ao carregar energia:", error);
    }
}

// Carrega as fases disponíveis para o usuário
async function loadPhases(user) {
    try {
        const response = await apiRequest(`/game/phases-length`,"GET");
        const lenPhases = response.count;
        const phasesContainer = document.getElementById("carousel-container");
        phasesContainer.innerHTML = "";

        for (let i = 1; i <= lenPhases; i++) {
            const phaseDiv = document.createElement("div");
            phaseDiv.classList.add("carousel-item");
            const button = document.createElement("button");
            button.innerHTML = `<span><img title="play icon" src="../img/icons/stadia_controller_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"></span><span>Fase ${i}</span>`;
            if (i <= user.current_phase) {
                button.onclick = () => {
                    window.location.href = `forca.html?phase=${i}`;
                };
            } else {
                button.disabled = true;
                button.classList.add("not-completed-phase");
            };
            phaseDiv.appendChild(button);
            phasesContainer.appendChild(phaseDiv);
        };
        
        initializeCarousel();
        const nextBtn = document.getElementById("nextBtn"); 
        for (let i=1;i<user.current_phase;i++){
            nextBtn.click();
        }
    } catch (error) {
        console.error("Erro ao carregar as fases:", error);
        showMessage("ERRO!", "Erro ao carregar as fases. Recarregando...", ["phases.html", "OK"]);
        return;
    }
}

// Inicializa o carrossel
function initializeCarousel() {
    const container = document.getElementById("carousel-container");
    const items = document.querySelectorAll(".carousel-item");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    let index = 0;

    container.style.transition = "transform 0.5s ease-in-out";

    function updateCarousel() {
        const itemWidth = items[0].offsetWidth;
        container.style.transform = `translateX(-${index * itemWidth}px)`;
    }

    nextBtn.onclick = () => {
        if (index < items.length - 1) {
            index++;
            updateCarousel();
        }
    };

    prevBtn.onclick = () => {
        if (index > 0) {
            index--;
            updateCarousel();
        }
    };
};

// Logout
window.logout = function (){
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Menu hamburger
window.toggleMenu = toggleMenu;

window.toggleTutorial = toggleTutorial;

// Chama a função ao carregar a página
window.onload = showPhases;