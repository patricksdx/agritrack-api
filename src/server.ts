import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";import { createServer } from "http";
import { connectDB, sequelize } from "./config/db";
import { AuthSocket } from "./controllers/AuthSocket";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
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

    io.on("connection", (socket: CustomSocket) => {
      console.log("🔌 Socket conectado:", socket.id);

      if (socket.user) {
        console.log("🔓 Usuario autenticado, acceso permitido:", socket.user);
      } else {
        console.log("⚠️ Usuario sin autenticación, solo login y register permitido.");
        new AuthSocket(socket);
      }
    });

    const PORT = 3000;
    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Servidor WebSocket escuchando en http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
})();
