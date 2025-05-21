import cron from "node-cron";
import { PlantaModel } from "../models/planta/PlantaModel";

cron.schedule("0 0 * * *", async () => {
  console.log("Bajando humedad de plantas...");

  try {
    const plantas = await PlantaModel.findAll();
    for (const planta of plantas) {
      const humedadActual = planta.getDataValue("planta_humedad") ?? 100;
      const nuevaHumedad = Math.max(0, humedadActual - 10);
      await planta.update({ planta_humedad: nuevaHumedad });
    }

    console.log("Actualización completada.");
  } catch (error) {
    console.error("Error al actualizar humedad de plantas:", error);
  }
});
