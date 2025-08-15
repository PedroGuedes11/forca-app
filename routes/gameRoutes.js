import express from "express";
import { getRanking, getWord , getPhasesLength } from "../controllers/gameController.js";

const router = express.Router();

router.get("/ranking", getRanking);
router.get("/word/:phaseId", getWord)
router.get("/phases-length", getPhasesLength);

export default router;