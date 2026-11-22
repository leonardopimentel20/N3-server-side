import { Router } from "express";
import { registrarEscolha, listarEscolhas } from "../controllers/escolhaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listarEscolhas);
router.post("/", verificarToken, registrarEscolha);

export default router;
