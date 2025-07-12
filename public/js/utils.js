// Lida com erros ndo banco de dados
export const handleDatabaseError = (err, res, message) => {
    res.status(500).json({ err , message : message });
};

// API para requisiçoes no banco de dados
export async function apiRequest(endpoint, method = "GET", body = null) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers.Authorization = token;
    }

    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });
        const data = await response.json();
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
    popup.classList.remove("hidden"); // Exibe o modal
};

// Menu hamburger
export const toggleMenu = function() {
    const navButtons = document.getElementById('nav-buttons');
    navButtons.classList.toggle('menu-open'); 
};