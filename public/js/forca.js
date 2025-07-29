import { apiRequest , showMessage , toggleMenu } from "./utils.js";

let attempts = 6; // Número de tentativas
let secretWord = ""; // Palavra secreta
let secretHints = []; // Dicas da palavra secreta
let dynamicList = []; // Lista dinâmica para armazenar as letras acertadas
let timer; // Variável para armazenar o intervalo do timer
let timeLeft = 30; // Tempo inicial em segundos

// Inicializa o jogo
async function startGame() {
    const token = localStorage.getItem("token"); // Obtém o token do localStorage
    const user = JSON.parse(localStorage.getItem("user")); // Obtém o usuário do localStorage
    const phase = getPhaseFromURL(); // Obtém a fase da URL
    window.currentPhase = phase; // Armazena a fase globalmente para reutilização

    try {
        verifyUserAccess(user, token, phase); // Verifica se o usuário tem acesso à fase
        await energyDecrement(); // Decrementa um ponto de energia
        await chooseWord(phase); // Carrega a palavra e as dicas do DB
        mountWordOnScreen(); // Monta a palavra na tela
        updateImage(); // Atualiza a imagem da forca
        updateHints(); // Atualiza as dicas na tela
        startTimer(); // Inicia o timer de 30 segundos
    } catch (error) {
        console.error("Erro ao iniciar o jogo:", error);
        alert("Erro ao carregar o jogo.");
        window.location.href="phases.html";
    }
}

// Recebe a fase da URL
function getPhaseFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const phase = urlParams.get("phase");
    if (!phase || isNaN(phase)) {
        alert("Fase inválida.");
        window.location.href = "phases.html";
    }
    return parseInt(phase, 10);
}

// Verifica se o usuário tem acesso à fase
function verifyUserAccess(user, token, phase) {
    if (!token || !user) {
        alert("Você precisa estar logado para jogar.");
        window.location.href = "login.html";
        return;
    }
    if (user.current_phase < phase) {
        alert("Você não tem acesso a esta fase.");
        window.location.href = "phases.html";
        return;
    }
}

// Decrementa um ponto de energia sempre que a pagina carrega
async function energyDecrement(){
    try {
        const response = await apiRequest("/user/decrement-energy", "POST");
        if (response.error) {
            alert(response.message || "Energia insuficiente.");
            window.location.href = "phases.html";
        }
    } catch (error) {
        alert("Erro ao decrementar energia.");
        window.location.href = "phases.html";
    }
}

// Carrega a palavra e as dicas do DB
async function chooseWord(phase) {
    try {
        const response = await apiRequest(`/game/word/${phase}`, "GET");

        if (!response) {
            throw new Error("Fase inválida ou não encontrada.");
        }

        secretWord = response.word;
        secretHints[0] = response.hint1;
        secretHints[1] = response.hint2;
        secretHints[2] = response.hint3;
        dynamicList = Array(secretWord.length).fill("_");
        if (secretWord.includes(" ")) {
            const indexBlankSpace = secretWord.indexOf(" ");
            dynamicList[indexBlankSpace] = ' ';
        }
    } catch (error) {
        console.error("Erro ao carregar a palavra da fase:", error);
        throw error;
    }
}

// Monta a palavra na tela
function mountWordOnScreen() {
    const screenWord = document.getElementById("secretword");
    screenWord.innerHTML = dynamicList
        .map((char) => (char === ' ' ? `<div class="blank block">${char}<br></div>`: (`<div class="letters">${char === "_" ? "&nbsp" : char}</div>`)))
        .join("");
}

// Implementa o carousel de dicas
const carouselItems = document.querySelectorAll('.hint')
const nextHintBtn = document.querySelector("#nextHintBtn")
const prevHintBtn = document.querySelector("#prevHintBtn")

let i = 0

const showNextSlide = () => {
  carouselItems.forEach(item => {
    item.classList.remove('visible')
    item.classList.add('hidden')
  })
  if (i === carouselItems.length - 1) {
    i = 0 
    return carouselItems[i].classList.add('visible') 
  } 
  i += 1
  carouselItems[i].classList.add('visible')
}

const showPrevSlide = () => {
  carouselItems.forEach(item => {
    item.classList.remove('visible')
    item.classList.add('hidden')
  })

  if (i === carouselItems.length - 3) {
    i = 2
    return carouselItems[i].classList.add('visible') 
  }
  i -= 1  
  carouselItems[i].classList.add('visible')
}

nextHintBtn.onclick = showNextSlide;
prevHintBtn.onclick = showPrevSlide;

// Verifica a letra escolhida
window.verifyLetter = function (letter) {
    const button = document.getElementById(`key-${letter}`);
    button.disabled = true;

    if (secretWord.includes(letter)) {
        updateDynamicList(letter);
        button.style.backgroundColor = "#008000"; // Verde para acerto
    } else {
        attempts--;
        updateImage();
        updateHints();
        button.style.backgroundColor = "#C71585"; // Vermelho para erro
    }

    mountWordOnScreen();
    verifyEndOfGame();
};

// Atualiza a lista dinâmica com a letra correta
function updateDynamicList(letter) {
    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letter) {
            dynamicList[i] = letter;
        }
    }
}

// Atualiza a imagem da forca
function updateImage() {
    const image = document.getElementById("image");
    image.innerHTML = `<img src='../img/forca/forca0${6 - attempts}.png' alt='img-forca' id='img-forca'></img>`;
}

// Atualiza as dicas na tela
function updateHints() {
    const attemptsDiv = document.getElementById("attempts");
    attemptsDiv.innerHTML = `<p>${attempts}❤️</p>`;
    if (attempts === 6) {
        document.getElementById("hint1").innerHTML = `${secretHints[0]}`;
    } else if (attempts === 4) {
        document.getElementById("hint2").innerHTML = `${secretHints[1]}`;
        document.getElementById("nextHintBtn").click();
    } else if (attempts === 2) {
        document.getElementById("hint3").innerHTML = `${secretHints[2]}`;
        if (document.getElementById("hint2").classList.contains("hidden")){
            document.getElementById("nextHintBtn").click();
            document.getElementById("nextHintBtn").click();
        } else {
            document.getElementById("nextHintBtn").click();
        }
    }
}

// Inicia o timer de 30 segundos
function startTimer() {
    const timerDiv = document.getElementById("timer");
    const phase = getPhaseFromURL();
    timerDiv.innerHTML = `${timeLeft}s`;


    timer = setInterval(() => {
        timeLeft--;
        timerDiv.innerHTML = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            attempts--;
            updateImage();
            updateHints();

            if (attempts > 0) {
                timeLeft = 30;
                startTimer();
            } else {
                showMessage("OPS!", "Seu tempo acabou...", ["phases.html","Escolher outra fase","forca.html?phase="+phase,"Tentar novamente"]);
                disableKeyboard();
            }
        }
    }, 1000); // Atualiza a cada segundo
}

// Verifica se o jogo terminou
function verifyEndOfGame() {
    const phase = getPhaseFromURL();
    const user = JSON.parse(localStorage.getItem("user"));
    if (dynamicList.join("") === secretWord) {
        if (phase === user.current_phase){
            updateLocalStorage(); //Atualiza o Local Storages
            updateCurrentPhaseInDatabase() // Atualiza a fase no banco de dados
        };
        incrementEnergy(); // Reincrementa a energia do usuário
        clearInterval(timer); // Para o timer
        disableKeyboard(); // Desativa o teclado
        showMessage("PARABÉNS!", "Você venceu! a palavra era: "+secretWord,["phases.html","Escolher outra fase","ranking.html","Ver Ranking"]);
    } else if (attempts === 0) {
        clearInterval(timer); // Para o timer
        disableKeyboard(); // Desativa o teclado
        showMessage("OPS!", "Suas vidas acabaram!",["phases.html","Escolher outra fase","forca.html?phase="+phase,"Tentar novamente"]);
    }
}

// Atualiza o Local Storage se houver liberacao de novas fases ao usuario
function updateLocalStorage(){
    const userToUpdate = JSON.parse(localStorage.getItem("user"))
    userToUpdate.current_phase++
    localStorage.removeItem("user")
    localStorage.setItem("user",JSON.stringify(userToUpdate))
}

// Reincrementa a energia do usuário
async function incrementEnergy() {
    try {
        const response = await apiRequest("/user/increment-energy", "POST");
        if (response.error) {
            throw new Error(response.message || "Erro ao incrementar energia.");
        }
        console.log("Energia incrementada com sucesso!");
    } catch (error) {
        console.error("Erro ao incrementar energia:", error);
    }
}

// Atualiza a fase do usuário no banco de dados caso ele passe de fase
async function updateCurrentPhaseInDatabase() {
    const newPhase = window.currentPhase + 1; // Reutiliza a fase armazenada

    try {
        const response = await apiRequest("/user/update-phase", "POST", { newPhase }); // Envia apenas newPhase
        if (!response.message==="Fase atualizada com sucesso!") {
            throw new Error(response.error, "Erro ao atualizar a fase.");
        }
    } catch (error) {
        console.error("Erro ao atualizar a fase no banco de dados:", error);
    }
}

// Bloqueia o teclado
function disableKeyboard() {
    const keywords = document.querySelectorAll(".keys button");
    keywords.forEach((button) => (button.disabled = true));
}

// Logout
window.logout = function (){
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Menu hamburger
window.toggleMenu = toggleMenu;

// Inicializa o jogo ao carregar a página
window.onload = startGame;