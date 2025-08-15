// API para requisiçoes no banco de dados
export async function apiRequest(endpoint, method = "GET", body = null) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers.Authorization = token;
    }

    const apiUrl = 'https://forca-app.onrender.com';
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });
        const data = await response.json();
        console.log("Requisição API feita com sucesso:", { endpoint, method, body });
        return data;
    } catch (error) {
        return console.log("Erro na requisição:", error);
    };

};

// Exibe uma mensagem de erro no popup modal
export function showMessage(title, message, buttons) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupMessage = document.getElementById("popup-message");
    const popupButtons = document.getElementById("modal-buttons");

    popupTitle.innerText = title;
    popupMessage.innerText = message;
    if(buttons.length === 2){ // Apenas um botao
        popupButtons.innerHTML = `<button onclick='window.location.href="`+buttons[0]+`"'>`+buttons[1]+`</button>`
    } else if(buttons.length > 2){ // Dois botoes
         popupButtons.innerHTML = `
            <button onclick='window.location.href="`+buttons[0]+`"'>`+buttons[1]+`</button>
            <button onclick='window.location.href="`+buttons[2]+`"'>`+buttons[3]+`</button>`
    }
    popup.classList.remove("hidden");
};

// Menu hamburger
export const toggleMenu = function() {
    const navButtons = document.getElementById('nav-buttons');
    navButtons.classList.toggle('menu-open'); 
};

// Tutorial da pagina
export const toggleTutorial = function() {
    const tutorial = document.getElementById('page-tutorial');
    tutorial.classList.toggle('hidden');
};