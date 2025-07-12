import express from "express";
import { updateCurrentPhase, updateUserInfo , getUserInfos , getUserEnergy , decrementEnergy , incrementEnergy } from "../controllers/userController.js"; 
import { validateToken, verifyUser } from "../middlewares/authMiddlewares.js"; 

const router = express.Router();

router.post("/update-phase", validateToken, verifyUser, updateCurrentPhase); // Atualiza a fase do usuário
router.put("/update-info", validateToken, verifyUser, updateUserInfo); // Atualiza as informações do usuário
router.get("/user-info", validateToken, verifyUser, getUserInfos); // Recebe as informacoes do usuario
router.get("/get-energy", validateToken, verifyUser, getUserEnergy); // Recebe a energia do usuário
router.post("/decrement-energy", validateToken, verifyUser, decrementEnergy); // Decrementa a energia do usuário
router.post("/increment-energy", validateToken, verifyUser, incrementEnergy); // Incrementa a energia do usuário

export default router;