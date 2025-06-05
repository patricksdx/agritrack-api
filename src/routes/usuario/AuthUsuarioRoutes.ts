import { Router } from "express";
import {
  registerUser,
  loginUser,
  obtenerUsuario,
} from "../../controllers/usuario/AuthUsuarioController";

const router = Router();

router.get("/obtenerUsuario", obtenerUsuario);
router.post("/registro", registerUser);
router.post("/login", loginUser);

export default router;
