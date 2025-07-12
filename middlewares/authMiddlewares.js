import { query } from "../model/db.js";
import jwt from "jsonwebtoken";
const { verify } = jwt;


const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para validar o token JWT
export const validateToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ error: "Token não fornecido." });
    }

    try {
        const decoded = verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};

// Middleware para verificar se o usuário está autenticado e se o ID é válido
export const verifyUser = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ error: "Usuário não autenticado ou ID inválido." });
    }

    const userId = req.user.id;

    query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Erro ao verificar usuário no MySQL:", err);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        req.user = results[0];
        next();
    });
};