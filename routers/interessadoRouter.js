import { Router } from "express";
import {
  criarInteressado,
  listarInteressados,
  buscarBicicletasDoInteressado,
  atualizarInteressado,
  deletarInteressado,
} from "../controllers/interessadoController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listarInteressados);
router.get("/:id", buscarBicicletasDoInteressado);
router.post("/", criarInteressado);
router.put("/:id", verificarToken, atualizarInteressado);
router.delete("/:id", verificarToken, deletarInteressado);

export default router;