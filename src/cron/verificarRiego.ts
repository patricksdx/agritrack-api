import cron from "node-cron";
import { PlantaModel } from "../models/planta/PlantaModel";
import { io, connectedUsers } from "../sockets/socketManager";

export const iniciarVerificacionDeRiego = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Ejecutando verificación de riego...");

    const plantas = await PlantaModel.findAll();
    const hoy = new Date();

    for (const planta of plantas) {
      const ultimaRiego = planta.getDataValue("planta_ultima_fecha_riego");
      const usuarioId = planta.getDataValue("planta_usuario_id");
      const nombre = planta.getDataValue("planta_nombre_comun");
      const plantaId = planta.getDataValue("planta_id");

      if (!ultimaRiego) continue;

      const diasSinRiego = Math.floor(
        (hoy.getTime() - new Date(ultimaRiego).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diasSinRiego >= 3) {
        const socketId = connectedUsers.get(usuarioId);
        if (socketId) {
          io.to(socketId).emit("alertaRiego", {
            mensaje: `Tu planta '${nombre}' no ha sido regada desde hace ${diasSinRiego} días.`,
            plantaId,
          });
          console.log(`Alerta enviada al usuario ${usuarioId}`);
        }
      }
    }
  });

  console.log("Cron job de verificación de riego iniciado (todos los días a las 9 AM).");
};
