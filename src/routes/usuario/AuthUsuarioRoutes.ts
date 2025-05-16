import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/usuario/AuthUsuarioController";

const router = Router();

router.post("/registro", registerUser);
router.post("/login", loginUser);

export default router;
