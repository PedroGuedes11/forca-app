import express from "express";
import { updateCurrentPhase, updateUserInfo , getUserInfos , getUserEnergy , decrementEnergy , incrementEnergy } from "../controllers/userController.js"; 
import { validateToken, verifyUser } from "../middlewares/authMiddlewares.js"; 

const router = express.Router();

router.post("/update-phase", validateToken, verifyUser, updateCurrentPhase);
router.put("/update-info", validateToken, verifyUser, updateUserInfo);
router.get("/user-info", validateToken, verifyUser, getUserInfos);
router.get("/get-energy", validateToken, verifyUser, getUserEnergy);
router.post("/decrement-energy", validateToken, verifyUser, decrementEnergy);
router.post("/increment-energy", validateToken, verifyUser, incrementEnergy);

export default router;