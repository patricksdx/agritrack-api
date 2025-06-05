import { Router } from "express";
import {
  registerUser,
  loginUser,
  obtenerUsuario,
} from "../../controllers/usuario/AuthUsuarioController";

const router = Router();

router.post("/registro", registerUser);
router.post("/login", loginUser);

router.get("/usuario", obtenerUsuario);

export default router;
