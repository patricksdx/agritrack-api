import { Router } from "express";
import { insertarPlanta, regarPlanta, obtenerPlantasConClima, listarPlantasBasico, borrarPlanta} from "../../controllers/planta/PlantaController";

const router = Router();

router.post("/agregarPlanta", insertarPlanta);
router.put("/regarPlanta/:plantaId", regarPlanta);
router.get("/listarPlantaClima/:plantaId", obtenerPlantasConClima);
router.get("/listarPlanta", listarPlantasBasico);
router.delete("/eliminarPlanta/:plantaId", borrarPlanta);

export default router;
