import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { validateToken } from "./middlewares/authMiddlewares.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { setup } from "./model/createTables.js";
import { createPhases } from "./model/createPhases.js";

dotenv.config();

const app = express();
app.use(express.json());

setup();
createPhases();

app.use(cors());

// Configura o caminho absoluto para os arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);

// Rota para validar o token
app.post("/validate-token", validateToken, (req, res) => {
    res.status(200).json({ message: "Token válido." });
});

// Redireciona para a página inicial (homepage.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "homepage.html"));
});

// Redireciona para a pagina de login
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

// Redireciona para a pagina de registro
app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "register.html"));
});

// Redireciona para a pagina de recuperar senha
app.get("/forgotpass.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "forgotpass.html"));
});

// Redireciona para a pagina de redefinir senha
app.get("/resetpass.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "resetpass.html"));
});

// Redireciona para a pagina de perfil
app.get("/profile.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "profile.html"));
});

// Redireciona para a pagina de fases
app.get("/phases.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "phases.html"));
});

// Redireciona para a pagina de ranking
app.get("/ranking.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "ranking.html"));
});

// Redireciona para a pagina do jogo
app.get("/forca.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "forca.html"));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});