import { Router } from "express";
import { insertarPlanta, regarPlanta, obtenerPlantasConClima } from "../../controllers/planta/PlantaController";

const router = Router();

router.post("/plantaInsert", insertarPlanta);
router.put("/:plantaId/regar", regarPlanta);
router.get("/:usuarioId/plantas", obtenerPlantasConClima);

export default router;
