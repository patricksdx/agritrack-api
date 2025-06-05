import cron from "node-cron";
import { PlantaModel } from "../models/planta/PlantaModel";

export const iniciarCronHumedad = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Ejecutando tarea diaria: bajando humedad de plantas...");

    try {
      const plantas = await PlantaModel.findAll();

      for (const planta of plantas) {
        const humedadActual = planta.getDataValue("planta_humedad") ?? 100;
        const ultimaFecha = planta.getDataValue("planta_ultima_fecha_riego");

        let nuevaHumedad = humedadActual;

        if (ultimaFecha) {
          const diasPasados = Math.floor(
            (new Date().getTime() - new Date(ultimaFecha).getTime()) / (1000 * 60 * 60 * 24)
          );
          nuevaHumedad = Math.max(0, humedadActual - (diasPasados * 5));
        } else {
          nuevaHumedad = Math.max(0, humedadActual - 5);
        }

        await planta.update({ planta_humedad: nuevaHumedad });
      }

      console.log("✅ Humedad de plantas actualizada correctamente.");
    } catch (error) {
      console.error("❌ Error al actualizar humedad de plantas:", error);
    }
  });
};
