import { Router } from "express";
import {
  registerUser,
  loginUser,
  obtenerUsuario,
} from "../../controllers/usuario/AuthUsuarioController";

const router = Router();

<<<<<<< HEAD
router.get("/obtenerUsuario", obtenerUsuario);
=======
router.get("/", obtenerUsuario);

>>>>>>> caf6257200c87bca90a681a121eed96f42a9612a
router.post("/registro", registerUser);
router.post("/login", loginUser);

export default router;
