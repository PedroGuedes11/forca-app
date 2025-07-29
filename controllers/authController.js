import { findUserByEmail, createUser, updatePassword, findUserByName } from "../model/db.js";
import { hash, compare } from "bcrypt";
import { createTransport } from "nodemailer";
import { handleDatabaseError } from "../public/js/utils.js";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt

// Carrega as variáveis de ambiente
const SECRET_KEY = process.env.SECRET_KEY;

// Função para registrar um novo usuário
export const register = async (req, res) => {
    // Verifica se o email e a senha foram fornecidos
    const { name, email, password } = req.body;

    // Verifica se o email já está registrado
    findUserByEmail(email, async (err, emailResults) => { 
        if (err) {
            handleDatabaseError(err, res, "Erro ao verificar email no PostgresSQL");
        }
        if (emailResults.length > 0) {
            return res.status(400).json({ error: true, message : "Email já registrado." });
        }
        findUserByName(name, async (err, nameResults) => {
            if(err){
                handleDatabaseError(err, res, "Erro ao verificar nome no PostgresSQL");
            }
            if (nameResults.length > 0){
                return res.status(400).json({ error: true, message : "Nome já registrado." });
            }

            try {
                const hashedPassword = await hash(password, 10); // Cria o hash da senha
            
                // Cria um novo usuário no banco de dados
                createUser(name, email, hashedPassword, (err) => {
                    if (err) {
                        return handleDatabaseError(err, res, "Erro ao registrar usuário no PostgreSQL");
                    }
                    return res.status(201).json({ error: false, message: "Usuário registrado com sucesso!" });
                });
            } catch (error) {
                return res.status(500).json({ error: true, message: "Erro ao registrar usuário." });
            }
        });
    });
}

// Função para fazer login do usuário
export const login = async (req, res) => {
    // Verifica se o email e a senha foram fornecidos
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true , message : "Email e senha são obrigatórios." });
    }

    // Verifica se o email é válido
    findUserByEmail(email, async (err, results) => {
        if (err) {
            return handleDatabaseError(err, res, "Erro ao buscar usuário no PostgreSQL");
        }
        if (results.length === 0) {
            return res.status(401).json({ error: true , message : "Credenciais inválidas." });
        }
        
        const user = results[0]; // Assume que o primeiro resultado é o usuário
        const isPasswordValid = await compare(password, user.password); // Verifica se a senha está correta

        // Verifica se a senha está correta
        if (!isPasswordValid) {
            return res.status(401).json({ error: true , message : "Credenciais inválidas." });
        }

        // Gera um token JWT
        const token = sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({
            error: false,
            message: "Login bem-sucedido!",
            user: { id: user.id, name: user.name, email: user.email, current_phase: user.current_phase , energy: user.energy },
            token
        });
    });
};

// Função para redefinir a senha do usuário
export const forgotPassword = async (req, res) => { 
    // Verifica se o email foi fornecido
    const { email } = req.body;

    // Verifica se o email está registrado
    findUserByEmail(email, async (err, results) => {
        if (err) {
            return handleDatabaseError(err, res, "Erro ao buscar usuário no PostgreSQL");
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Email não encontrado." });
        }

        // Gera um token de redefinição de senha
        const resetToken = sign({ email }, SECRET_KEY, { expiresIn: "15m" });
        // Cria o link de redefinição de senha
        const resetLink = `http://localhost:3000/resetpass.html?token=${resetToken}`;

        // Envia o email com o link de redefinição de senha
        const transporter = createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log(transporter);

        // Configurações do email
        try {
            await transporter.sendMail({
                from: "pedropinheiroguedes@gmail.com",
                to: email,
                subject: "Redefinição de senha",
                html: `<p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
            });

            return res.status(200).json({ error: false, message: "Instruções enviadas para o email." });
        } catch (error) {
            return res.status(500).json({ error: true , message : "Erro ao enviar email." });
        }
    });
};

// Função para redefinir a senha do usuário
export const resetPassword = async (req, res) => {
    // Verifica se o token e a nova senha foram fornecidos
    const { newPassword , token } = req.body;
    

    // Verifica se o token e a nova senha são válidos
    if (!newPassword || !token) {
        return res.status(400).json({ error: true , message : "Senha e token sao obrigatórios." });
    }
    try { 
        const decoded = verify(token, SECRET_KEY);
        const hashedPassword = await hash(newPassword, 10);

        // Atualiza a senha no banco de dados
        updatePassword(decoded.email, hashedPassword,(err) => {
            if (err) {
                handleDatabaseError(err, res, "Erro ao atualizar senha no PostgreSQL");
            }
            return res.status(200).json({ error : false ,  message: "Senha redefinida com sucesso!" });
        });
    } catch (error) {
        return res.status(400).json({ error: true , message : "Token inválido ou expirado." });
    }
};

