import express from "express";
import { getRanking, getWord , getPhasesLength } from "../controllers/gameController.js";

const router = express.Router();

router.get("/ranking", getRanking); // Recebe o ranking do banco de dados
router.get("/word/:phaseId", getWord); // Recebe a string da fase correspondente do banco de dados
router.get("/phases-length", getPhasesLength); // Recebe o numero de fases armazenadas no banco de dados

export default router;