import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import compression from "compression";

import { connectDB, sequelize } from "./config/db";
import { corsOptions } from "./config/utils/cors";

import authUsuarioRouter from "./routes/usuario/AuthUsuarioRoutes";
import plantasRouter from "./routes/planta/PlantasRoutes";

const app = express();
app.use(compression());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use("/api/usuario/auth", authUsuarioRouter);
app.use("/api/plantas", plantasRouter);

io.on("connection", (socket) => {
  console.log("🔌 Socket conectado:", socket.id);
});

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("📜 Base de datos lista.");

    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || "http://192.168.0.35";

    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
})();
