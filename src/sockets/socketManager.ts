import { Server } from "socket.io";
import { corsOptions } from "../config/utils/cors";

export const connectedUsers = new Map<number, string>(); // usuario_id -> socket.id
export let io: Server;

export const inicializarSockets = (server: any) => {
  io = new Server(server, {
    cors: { origin: corsOptions.origin}
  });
  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    socket.on("registrarUsuario", (usuarioId: number) => {
      connectedUsers.set(usuarioId, socket.id);
      console.log(`Usuario ${usuarioId} registrado con socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [uid, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(uid);
          break;
        }
      }
      console.log("Cliente desconectado:", socket.id);
    });
  });
};
