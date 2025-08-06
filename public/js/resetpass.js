import { apiRequest, showMessage } from "./utils.js";

// Tela para redefinir a senha
async function resetPasswordScreen() {
    localStorage.setItem("token",getTokenFromURL());
    const token = localStorage.getItem("token");
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;
        
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            showMessage("ERRO!","A nova senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um caractere especial.",["resetpass.html?token="+token,"OK"]);
            return;
        }
        if (newPassword===confirmNewPassword){
            const response = await apiRequest("/auth/reset-password", "PUT", { newPassword , token });
            if (response.message==="Senha redefinida com sucesso!"){
                localStorage.removeItem("token");
                showMessage("Sucesso!", response.message,["public/html/login.html","Fazer login"]);
            }else{
                showMessage("ERRO!", response.message, ["resetpass.html?token="+token, "Tente novamente"]);
            }
        } else {
            showMessage("ERRO!","Os dois campos devem ser iguais. Tente novamente.",["resetpass.html?token="+token,"OK"])
        }
    })
};

// Recebe o token da URL
function getTokenFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (!token) {
        showMessage("ERRO!", "Token inválido ou ausente. Você será redirecionado para a página inicial.", ["https://forca-app.onrender.com", "OK"]);
        window.location.href = "https://forca-app.onrender.com";
    }
    return token;
}

window.onload = resetPasswordScreen;