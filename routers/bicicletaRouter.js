import { Router } from "express";
import {
    criarBicicleta,
    listarBicicletas,
    buscarBicicletaPorCodigo,
    atualizarBicicleta,
    deletarBicicleta,
} from "../controllers/bicicletaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listarBicicletas);
router.get("/:codigo", buscarBicicletaPorCodigo);
router.post("/", verificarToken, criarBicicleta);
router.put("/:codigo", verificarToken, atualizarBicicleta);
router.delete("/:codigo", verificarToken, deletarBicicleta);

export default router;