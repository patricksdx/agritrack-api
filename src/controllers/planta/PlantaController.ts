import { PlantaModel } from "../../models/planta/PlantaModel";
import { getClimaActual } from "../../services/ClimaDatos";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY as string;

export const insertarPlanta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "No se encontró token de autenticación" });
      return;
    }
    const decoded = jwt.verify(token, SECRET_KEY) as { usuario_id: number };
    const usuarioId = decoded.usuario_id;
    const nuevaPlanta = await PlantaModel.create({
     
      planta_nombre_comun: req.body.planta_nombre_comun,
      planta_descripcion: req.body.planta_descripcion,
      planta_ubicacion: req.body.planta_ubicacion,
      planta_latitud: req.body.planta_latitud,
      planta_longitud: req.body.planta_longitud,
      planta_fecha_adquisicion: req.body.planta_fecha_adquisicion,
      planta_foto: req.body.planta_foto,
      planta_humedad: 100,
      planta_usuario_id: usuarioId,
    });

    res.status(201).json({
      mensaje: "Planta creada correctamente",
      planta: nuevaPlanta,
    });
  } catch (error) {
    console.error("Error al insertar planta:", error);
    res.status(500).json({ error: "No se pudo crear la planta" });
  }
};

export const regarPlanta = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ error: "No se encontró token de autenticación" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { usuario_id: number };
    const usuarioId = decoded.usuario_id;

    const plantaId = parseInt(req.params.plantaId ?? "0");
    if (isNaN(plantaId) || plantaId <= 0) {
      res.status(400).json({ error: "ID de planta inválido" });
      return;
    }

    const planta = await PlantaModel.findOne({
      where: {
        planta_id: plantaId,
        planta_usuario_id: usuarioId, // Asegura que la planta le pertenezca al usuario autenticado
      },
    });

    if (!planta) {
      res.status(404).json({ error: "Planta no encontrada o no pertenece al usuario" });
      return;
    }

    await planta.update({
      planta_humedad: 100,
      planta_ultima_fecha_riego: new Date(),
    });

    res.status(200).json({
      mensaje: "Planta regada correctamente",
      planta,
    });
  } catch (error) {
    console.error("Error al regar la planta:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
export const obtenerPlantasConClima = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ error: "No se encontró token de autenticación" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { usuario_id: number };
    const usuarioId = decoded.usuario_id;

    const plantaId = parseInt(req.params.plantaId ?? (req.query.plantaId as string));
    if (isNaN(plantaId)) {
      res.status(400).json({ error: "ID de planta inválido" });
      return;
    }

    const planta = await PlantaModel.findOne({
      where: {
        planta_id: plantaId,
        planta_usuario_id: usuarioId,
      },
    });

    if (!planta) {
      res.status(404).json({ error: "Planta no encontrada o no pertenece al usuario" });
      return;
    }

    // Extraemos los datos planos del modelo Sequelize
    const {
      planta_nombre_comun,
      planta_descripcion,
      planta_ubicacion,
      planta_foto,
      planta_humedad,
      planta_ultima_fecha_riego,
      planta_latitud,
      planta_longitud,
      planta_humedad_clima,
    } = planta.get({ plain: true });

    const lat = planta_latitud ?? -34.6037;
    const lon = planta_longitud ?? -58.3816;

    let humedadUsuario = planta_humedad ?? 0;

    if (planta_ultima_fecha_riego) {
      const ultimaFecha = new Date(planta_ultima_fecha_riego);
      const hoy = new Date();
      const diasPasados = Math.floor((hoy.getTime() - ultimaFecha.getTime()) / (1000 * 60 * 60 * 24));
      const perdidaHumedad = diasPasados * 5; // 5% por día
      humedadUsuario = Math.max(0, humedadUsuario - perdidaHumedad);
    }

    const clima = await getClimaActual(lat, lon);

    if (clima && clima.humedad !== undefined) {
      if (planta_humedad_clima !== Math.floor(clima.humedad)) {
        planta.planta_humedad_clima = Math.floor(clima.humedad);
        await planta.save();
      }
    }

    res.status(200).json({
      clima: clima
        ? {
            hora: clima.hora,
            temperatura: clima.temperatura,
            luzSolar: clima.luzSolar,
            humedad: clima.humedad,
            estado: clima.esDeDia ? "Día" : "Noche",
          }
        : null,
      planta: {
        planta_nombre_comun,
        planta_descripcion,
        planta_ubicacion,
        planta_foto,
        planta_humedad: Math.floor(humedadUsuario),
        planta_humedad_clima: planta.planta_humedad_clima ?? null,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const listarPlantasBasico = async (req: Request, res: Response): Promise<void> => { 
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ error: "No se encontró token de autenticación" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { usuario_id: number };
    const usuarioId = decoded.usuario_id;

    const plantas = await PlantaModel.findAll({
      attributes: ["planta_id", "planta_nombre_comun", "planta_ubicacion", "planta_foto"],
      where: { planta_usuario_id: usuarioId },
    });

    if (plantas.length === 0) {
      res.status(200).json({ mensaje: "Aún no se han registrado plantas" });
      return;
    }

    res.status(200).json({ plantas });
  } catch (error) {
    console.error("Error al listar plantas:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const borrarPlanta = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ error: "No se encontró token de autenticación" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { usuario_id: number };
    const usuarioId = decoded.usuario_id;

    const plantaId = parseInt(req.params.plantaId ?? "0");
    if (isNaN(plantaId) || plantaId <= 0) {
      res.status(400).json({ error: "ID de planta inválido" });
      return;
    }

    const planta = await PlantaModel.findOne({
      where: {
        planta_id: plantaId,
        planta_usuario_id: usuarioId, // Validamos que la planta sea del usuario autenticado
      },
    });

    if (!planta) {
      res.status(404).json({ error: "Planta no encontrada o no pertenece al usuario" });
      return;
    }

    await planta.destroy();

    res.status(200).json({ mensaje: "Planta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la planta:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
