import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UsuarioModel } from "../../models/usuario/UsuarioModel";
import type { Request, Response } from "express";

const SECRET_KEY = process.env.SECRET_KEY as string;

export const obtenerUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
<<<<<<< HEAD
    const token = req.cookies.authToken;
    if (!token) {
      res
        .status(401)
        .json({ message: "No se encontró token de autenticación" });
      return;
    }
    const decoded = jwt.verify(token, SECRET_KEY) as {
      usuario_id: number;
      usuario_email: string;
    };

    const usuario_id = decoded.usuario_id;

    const user = await UsuarioModel.findOne({ where: { usuario_id } });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({
      message: "Usuario encontrado",
      usuario: user,
    });
  } catch (error) {
    console.error("❌ Error al verificar token o buscar usuario:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

=======
    const { authToken } = req.cookies;
    if (!authToken) {
      res.status(400).json({ message: "Falta token" });
      return;
    }
    const decoded = jwt.verify(authToken, SECRET_KEY) as {
      usuario_id: number;
      usuario_email: string;
    };
    const user = await UsuarioModel.findOne({
      where: { usuario_id: decoded.usuario_id },
    });
    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({
      message: "Usuario encontrado",
      user: user,
    });
  } catch (error) {
    console.error("❌ Error en la obtención del usuario:", error);
    res.status(400).json({ message: "Error en la obtención del usuario" });
    return;
  }
};
>>>>>>> caf6257200c87bca90a681a121eed96f42a9612a
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
      return;
    }

    const {
      usuario_username,
      usuario_nombres,
      usuario_apellidos,
      usuario_email,
      usuario_password,
    } = req.body;

    if (
      !usuario_username ||
      !usuario_nombres ||
      !usuario_apellidos ||
      !usuario_email ||
      !usuario_password
    ) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
      return;
    }

    const userExistente = await UsuarioModel.findOne({
      where: { usuario_email: usuario_email },
    });
    if (userExistente) {
      res.status(400).json({ message: "El email ya existe" });
      return;
    }

    const userExistenteUsuario = await UsuarioModel.findOne({
      where: { usuario_username: usuario_username },
    });
    if (userExistenteUsuario) {
      res.status(400).json({ message: "El nombre de usuario ya existe" });
      return;
    }

    const newUser = await UsuarioModel.create({
      usuario_username,
      usuario_nombres,
      usuario_apellidos,
      usuario_email,
      usuario_password: await bcrypt.hash(usuario_password, 10),
    });

    console.log("✅ Usuario registrado:", newUser.get());

    res.status(200).json({
      message: "Registro exitoso",
    });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🚀 Login de usuario");
    const { usuario_email, usuario_password } = req.body;

    if (!usuario_email || !usuario_password) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
      return;
    }

    const user = await UsuarioModel.findOne({
      where: { usuario_email: usuario_email },
    });

    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      usuario_password,
      user.getDataValue("usuario_password")
    );
    if (!passwordMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token = jwt.sign(
      {
        usuario_id: user.getDataValue("usuario_id"),
        usuario_email: user.getDataValue("usuario_email"),
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login exitoso",
      user: user,
    });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    return;
  }
};
