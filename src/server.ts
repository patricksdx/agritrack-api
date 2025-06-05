import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { iniciarCronHumedad } from "./cron/ActualizarHumedad";
import { connectDB, sequelize } from "./config/db";
import { corsOptions } from "./config/utils/cors";

import authUsuarioRouter from "./routes/usuario/AuthUsuarioRoutes";
import plantasRouter from "./routes/planta/PlantasRoutes";

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

iniciarCronHumedad();

app.use("/api/usuario", authUsuarioRouter);
app.use("/api/plantas", plantasRouter);

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("📜 Base de datos lista.");

    app.listen(process.env.PORT, () => {
      console.log(
        `🚀 Servidor escuchando en http://192.168.0.5:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
})();
