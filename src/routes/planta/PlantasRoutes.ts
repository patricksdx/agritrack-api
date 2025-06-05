import { Router } from "express";
import { insertarPlanta, regarPlanta, obtenerPlantasConClima, listarPlantasBasico, borrarPlanta} from "../../controllers/planta/PlantaController";

const router = Router();

router.post("/plantaInsert", insertarPlanta);
router.put("/:plantaId/regar", regarPlanta);
router.get("/:usuarioId/ListarPlantaClima", obtenerPlantasConClima);
router.get(":usuarioId/ListarPlanta", listarPlantasBasico);
router.delete("/:plantaId/BorrarPlanta", borrarPlanta);

export default router;
