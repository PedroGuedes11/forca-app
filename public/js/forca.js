import { apiRequest , showMessage , toggleMenu } from "./utils.js";

let attempts = 6; // Número de tentativas
let secretWord = ""; // Palavra secreta
let secretHints = []; // Dicas da palavra secreta
let dynamicList = []; // Lista dinâmica para armazenar as letras acertadas
let timer; // Variável para armazenar o intervalo do timer
let timeLeft = 30; // Tempo inicial em segundos

// Inicializa o jogo
async function startGame() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const phase = getPhaseFromURL();
    window.currentPhase = phase;

    try {
        verifyUserAccess(user, token, phase);
        await energyDecrement();
        await chooseWord(phase);
        mountWordOnScreen();
        updateImage();
        updateHints();
        startTimer();
        console.log("Jogo iniciado com sucesso.");
    } catch (error) {
        console.error("Erro ao iniciar o jogo:", error);
        showMessage("OPS!", "Ocorreu um erro ao iniciar o jogo, você será redirecionado.", ['window.location.href="phases.html"', "OK"]);
    }
}

// Recebe a fase da URL
function getPhaseFromURL() {
    console.log("Obtendo fase da URL...");
    const urlParams = new URLSearchParams(window.location.search);
    const phase = urlParams.get("phase");
    if (!phase || isNaN(phase)) {
        showMessage("ERRO!", "Fase inválida.", ['window.location.href="phases.html"', "OK"]);
        return;
    }
    console.log("Fase recebida com sucesso.");
    return parseInt(phase, 10);
}

// Verifica se o usuário tem acesso à fase
function verifyUserAccess(user, token, phase) {
    console.log("Verificando acesso do usuário...");
    if (!token || !user) {
        showMessage("ERRO!", "Você precisa estar logado para jogar.", ['window.location.href="login.html"', "Login"]);
        return;
    }
    if (user.current_phase < phase) {
        showMessage("ERRO!", "Você não tem acesso a esta fase.", ['window.location.href="phases.html"', "OK"]);
        return;
    }
    console.log("Acesso à fase verificado.");
}

// Decrementa um ponto de energia sempre que a pagina carrega
async function energyDecrement(){
    console.log("Decrementando energia...");
    try {
        const response = await apiRequest("/user/decrement-energy", "POST");
        if (response.error) {
            console.error("Erro ao decrementar energia:", response.error);
            disableKeyboard();
            clearInterval(timer);
            showMessage("ERRO!", response.error+" Você será redirecionado.", ['window.location.href="login.html"', "OK"]);
            return;
        }
        console.log("Energia decrementada.");
    } catch (error) {
        console.error("Erro ao decrementar energia:", error);
        return;
    }
}

// Carrega a palavra e as dicas do DB
async function chooseWord(phase) {
    console.log("Escolhendo palavra para a fase", phase);
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
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === " ") {
                dynamicList[i] = " ";
            }
        }
        console.log("Palavra e dicas carregadas.");
    } catch (error) {
        console.error("Erro ao carregar a palavra:", error);
        showMessage("ERRO!", "Erro ao carregar a palavra da fase.", ['window.location.href="phases.html"', "OK"]);
        return;
    }
}

// Monta a palavra na tela
function mountWordOnScreen() {
    console.log("Montando a palavra na tela...");
    const screenWord = document.getElementById("secretword");
    screenWord.innerHTML = dynamicList
        .map((char) => (
            char === ' ' ? `<div class="blank">${char}<br></div>`: (`<div class="letters">${char === "_" ? "&nbsp" : char}</div>`)))
        .join("");
    console.log("Palavra montada.");
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
    console.log("Verificando letra:", letter);
    const button = document.getElementById(`key-${letter}`);
    button.disabled = true;

    if (secretWord.includes(letter)) {
        updateDynamicList(letter);
        button.style.backgroundColor = "#008000";
    } else {
        attempts--;
        updateImage();
        updateHints();
        button.style.backgroundColor = "#C71585";
    }

    mountWordOnScreen();
    verifyEndOfGame();
};

// Atualiza a lista dinâmica com a letra correta
function updateDynamicList(letter) {
    console.log("Atualizando lista dinâmica...");
    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letter) {
            dynamicList[i] = letter;
        }
    }
    console.log("Lista dinâmica atualizada.");
}

// Atualiza a imagem da forca
function updateImage() {
    console.log("Atualizando imagem da forca...");
    const image = document.getElementById("image");
    image.innerHTML = `<img src='../img/forca/forca0${6 - attempts}.png' alt='img-forca' id='img-forca'></img>`;
    console.log("Imagem da forca atualizada.");
}

// Atualiza as dicas na tela
function updateHints() {
    console.log("Atualizando dicas...");
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
    console.log("Dicas atualizadas.");
}

// Inicia o timer de 30 segundos
function startTimer() {
    console.log("Iniciando o timer de 30 segundos...");
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
                showMessage("OPS!", "Seu tempo acabou...", [
                    'window.location.href="phases.html"', "Voltar às fases", 
                    "forca.html?phase=" + phase, "Tentar novamente", 
                    'window.location.href="ranking.html"', "Ver ranking"]);
                disableKeyboard();
            }
        }
    }, 1000); // Atualiza a cada segundo
    console.log("Timer iniciado.");
}

// Verifica se o jogo terminou
function verifyEndOfGame() {
    console.log("Verificando fim do jogo...");
    const phase = getPhaseFromURL();
    const user = JSON.parse(localStorage.getItem("user"));
    if (dynamicList.join("") === secretWord) {
        if (phase === user.current_phase){
            updateLocalStorage();
            updateCurrentPhaseInDatabase()
        };
        incrementEnergy();
        clearInterval(timer);
        disableKeyboard();
        showMessage("PARABÉNS!", "Você venceu! a palavra era: "+secretWord,[
            'window.location.href="phases.html"',"Voltar às fases",
            "forca.html?phase="+(phase+1),"Próxima fase",
            'window.location.href="ranking.html"', "Ver ranking"]);
    } else if (attempts === 0) {
        clearInterval(timer);
        disableKeyboard();
        showMessage("OPS!", "Suas vidas acabaram!",[
            'window.location.href="phases.html"', "Voltar às fases",
            "forca.html?phase="+phase,"Tentar novamente",
            'window.location.href="ranking.html"', "Ver ranking"]);
    }
}

// Atualiza o Local Storage se houver liberacao de novas fases ao usuario
function updateLocalStorage(){
    console.log("Atualizando armazenamento local...");
    const userToUpdate = JSON.parse(localStorage.getItem("user"))
    userToUpdate.current_phase++
    localStorage.removeItem("user")
    localStorage.setItem("user",JSON.stringify(userToUpdate))
    console.log("Armazenamento local atualizado.");
}

// Reincrementa a energia do usuário
async function incrementEnergy() {
    console.log("Reincremetando energia...");
    try {
        const response = await apiRequest("/user/increment-energy", "POST");
        if (response.error) {
            throw new Error(response.message || "Erro ao incrementar energia.");
        }
    } catch (error) {
        console.error("Erro ao reincrementar energia:", error);
    }
    console.log("Energia reincrementada.");
}

// Atualiza a fase do usuário no banco de dados caso ele passe de fase
async function updateCurrentPhaseInDatabase() {
    console.log("Atualizando fase no banco de dados...");
    const newPhase = window.currentPhase + 1;

    try {
        const response = await apiRequest("/user/update-phase", "POST", { newPhase });
        if (response.message !== "Fase atualizada com sucesso!") {
            throw new Error(response.error || "Erro ao atualizar a fase no banco de dados.");
        }
    } catch (error) {
        console.error("Erro ao atualizar a fase no banco de dados:", error);
    }
    console.log("Fase atualizada com sucesso.");
}

// Bloqueia o teclado
function disableKeyboard() {
    const keywords = document.querySelectorAll(".keys button");
    keywords.forEach((button) => (button.disabled = true));
    console.log("Teclado desativado.");
}

// Logout
window.logout = function (){
    console.log("Saindo do perfil...");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Menu hamburger
window.toggleMenu = toggleMenu;

// Inicializa o jogo ao carregar a página
window.onload = startGame;