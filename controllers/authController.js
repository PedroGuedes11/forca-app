import { findUserByEmail, createUser, updatePassword, findUserByName } from "../model/db.js";
import { hash, compare } from "bcrypt";
import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

const SECRET_KEY = process.env.SECRET_KEY;

// Função para registrar um novo usuário
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const emailResults = await findUserByEmail(email);
        if (emailResults.length > 0) {
            return res.status(400).json({ error: true, message: "Email já registrado." });
        }
        const nameResults = await findUserByName(name);
        if (nameResults.length > 0) {
            return res.status(400).json({ error: true, message: "Nome já registrado." });
        }
        const hashedPassword = await hash(password, 10);
        await createUser(name, email, hashedPassword);
        return res.status(201).json({ error: false, message: "Usuário registrado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Erro ao registrar usuário." });
    }
};

// Função para fazer login do usuário
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Email e senha são obrigatórios." });
    }
    try {
        const results = await findUserByEmail(email);
        if (results.length === 0) {
            return res.status(401).json({ error: true, message: "Credenciais inválidas." });
        }
        const user = results[0];
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: true, message: "Credenciais inválidas." });
        }
        const token = sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
            error: false,
            message: "Login bem-sucedido!",
            user: { id: user.id, name: user.name, email: user.email, current_phase: user.current_phase, energy: user.energy },
            token
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Erro ao fazer login." });
    }
};

// Função para redefinir a senha do usuário (envio do email)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const results = await findUserByEmail(email);
        if (results.length === 0) {
            return res.status(404).json({ error: "Email não encontrado." });
        }
        const resetToken = sign({ email }, SECRET_KEY, { expiresIn: "15m" });
        const resetLink = `https://forca-app.onrender.com/resetpass.html?token=${resetToken}`;
        const transporter = createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: "pedropinheiroguedes@gmail.com",
            to: email,
            subject: "Redefinição de senha",
            html: `<p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
        });
        return res.status(200).json({ error: false, message: "Instruções enviadas para o email." });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Erro ao enviar email." });
    }
};

// Função para redefinir a senha do usuário (atualização)
export const resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) {
        return res.status(400).json({ error: true, message: "Senha e token são obrigatórios." });
    }
    try {
        const decoded = verify(token, SECRET_KEY);
        const hashedPassword = await hash(newPassword, 10);
        await updatePassword(decoded.email, hashedPassword);
        return res.status(200).json({ error: false, message: "Senha redefinida com sucesso!" });
    } catch (error) {
        return res.status(400).json({ error: true, message: "Token inválido ou expirado." });
    }
};

