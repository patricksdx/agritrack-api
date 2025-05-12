import { Socket } from "socket.io";
import { UsuarioModel } from "../models/UsuarioModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export class AuthSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.initializeListeners();
  }

  private initializeListeners() {

    if (!SECRET_KEY) {
      return console.error("Falta la clave de seguridad.");
    }

    // 🔐 Registro de usuario
    this.socket.on("registroUsuario", async (rawData) => {
      const data = JSON.parse(rawData);

      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.usuario_password, salt);

        const nuevoUsuario = await UsuarioModel.create({
          usuario_username: data.usuario_username,
          usuario_nombres: data.usuario_nombres,
          usuario_apellidos: data.usuario_apellidos,
          usuario_email: data.usuario_email,
          usuario_password: hashedPassword,
        });

        console.log("✅ Usuario registrado:", nuevoUsuario.get());
        this.socket.emit("registroExitoso", {
          message: "Registro exitoso",
          usuario: nuevoUsuario,
        });
      } catch (error: any) {
        console.error("❌ Error en el registro:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido"; 

        this.socket.emit("registroError", {
          message: "Error al registrar usuario",
          error: errorMessage,
        });
      }
    });

    // 🔑 Login de usuario
    this.socket.on("loginUsuario", async (rawData) => {
      const data = JSON.parse(rawData);

      try {
        const usuario = await UsuarioModel.findOne({
          where: { usuario_email: data.usuario_email },
        });

        if (!usuario) {
          this.socket.emit("loginError", { message: "Usuario no encontrado" });
          return;
        }

        const passwordMatch = await bcrypt.compare(
          data.usuario_password,
          usuario.getDataValue("usuario_password")
        );
        if (!passwordMatch) {
          this.socket.emit("loginError", { message: "Contraseña incorrecta" });
          return;
        }

        const token = jwt.sign(
          {
            usuario_id: usuario.getDataValue("usuario_id"),
            usuario_email: usuario.getDataValue("usuario_email"),
          },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        this.socket.emit("loginExitoso", {
          message: "Login exitoso",
          token,
          cookie: `authToken=${token}; path=/; HttpOnly`,
        });
      } catch (error) {
        console.error("❌ Error en el login:", error);
        this.socket.emit("loginError", { message: "Error al iniciar sesión" });
      }
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado:", this.socket.id);
    });
  }
}
