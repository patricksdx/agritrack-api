import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import { connectDB, sequelize } from "./config/db";
import { corsOptions } from "./config/utils/cors";

import authUsuarioRouter from "./routes/usuario/AuthUsuarioRoutes";
import plantasRouter from "./routes/planta/PlantasRoutes";

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions,
});

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("📜 Base de datos lista.");

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      throw new Error("Falta la clave de seguridad.");
    }

    interface CustomSocket extends Socket {
      user?: { usuario_id: number; usuario_email: string };
    }

    io.use((socket: CustomSocket, next) => {
      const cookies = socket.handshake.headers.cookie;

      if (cookies) {
        const tokenMatch = cookies.match(/authToken=([^;]*)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (token) {
          try {
            const decoded = jwt.verify(token, SECRET_KEY) as {
              usuario_id: number;
              usuario_email: string;
            };
            socket.user = decoded;
            console.log("✅ Usuario autenticado:", socket.user);
          } catch (error) {
            console.error("❌ Token inválido:", error);
          }
        }
      }

      next();
    });

    app.use("/api/usuario", authUsuarioRouter);
    app.use("/api/plantas", plantasRouter);

    io.on("connection", (socket: CustomSocket) => {
      console.log("🔌 Socket conectado:", socket.user?.usuario_email);

      if (socket.user) {
        console.log("🔓 Usuario autenticado, acceso permitido:", socket.user);
      } else {
        console.log(
          "⚠️ Usuario sin autenticación, solo login y register permitido."
        );
      }
    });

    httpServer.listen(process.env.PORT, () => {
      console.log(
        `🚀 Servidor escuchando en http://192.168.0.5:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
})();
