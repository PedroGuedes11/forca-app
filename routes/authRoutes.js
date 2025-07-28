import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",register); // Registra um novo usuário
router.post("/login", login); // Faz login do usuário
router.post("/forgot-password", forgotPassword); // Envia email de redefinição de senha
router.put("/reset-password", resetPassword); // Redefine a senha do usuário

export default router;