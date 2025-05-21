import { PlantaModel } from "../../models/planta/PlantaModel";
import { getClimaActual } from "../../services/ClimaDatos";
import type { Request, Response } from "express";

export const insertarPlanta = async (req: Request, res: Response) => {
  try {
    const nuevaPlanta = await PlantaModel.create({
      planta_nombre_comun: req.body.planta_nombre_comun,
      planta_descripcion: req.body.planta_descripcion,
      planta_ubicacion: req.body.planta_ubicacion,
      planta_latitud: req.body.planta_latitud,
      planta_longitud: req.body.planta_longitud,
      planta_fecha_adquisicion: req.body.planta_fecha_adquisicion,
      planta_foto: req.body.planta_foto,
      planta_humedad: 100,
      planta_usuario_id: req.body.planta_usuario_id,
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

  const plantaId = parseInt(req.params.plantaId ?? "0");
  if (isNaN(plantaId) || plantaId <= 0) {
    res.status(400).json({ error: "ID de planta inválido" });
    return;
  }

  try {
    const planta = await PlantaModel.findByPk(plantaId);

    if (!planta) {
      res.status(404).json({ error: "Planta no encontrada" });
      return;
    }

    await planta.update({
      planta_humedad: 100,
      planta_ultima_fecha_riego: new Date(),
    });

    res.json({
      mensaje: "Planta regada correctamente",
      planta: planta,
    });
  } catch (error) {
    console.error("Error al regar la planta:", error);
    res.status(500).json({ error: "No se pudo regar la planta" });
  }
};

export const obtenerPlantasConClima = async (req: Request, res: Response) => {
  const usuarioId = parseInt(req.params.usuarioId ?? "0");
  const lat = -34.6037;
  const lon = -58.3816;

  try {
    const plantas = await PlantaModel.findAll({
      where: { planta_usuario_id: usuarioId },
    });

    const plantasActualizadas = plantas.map((planta) => {
      const { 
        planta_nombre_comun, 
        planta_descripcion, 
        planta_ubicacion, 
        planta_foto, 
        planta_humedad, 
        planta_ultima_fecha_riego 
      } = planta as any;

      let humedad = planta_humedad ?? 0;

      if (planta_ultima_fecha_riego) {
        const ultimaFecha = new Date(planta_ultima_fecha_riego);
        const hoy = new Date();
        const diasPasados = Math.floor((hoy.getTime() - ultimaFecha.getTime()) / (1000 * 60 * 60 * 24));
        const perdidaHumedad = diasPasados * 5; // 5% por día
        humedad = Math.max(0, humedad - perdidaHumedad);
      }

      return {
        planta_nombre_comun,
        planta_descripcion,
        planta_ubicacion,
        planta_foto,
        planta_humedad: Math.floor(humedad),
      };
    });

    const clima = await getClimaActual(lat, lon);

    res.json({
      clima: clima
        ? {
            hora: clima.hora,
            temperatura: clima.temperatura,
            luzSolar: clima.luzSolar,
            estado: clima.esDeDia ? "Día" : "Noche",
          }
        : null,
      plantas: plantasActualizadas,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
};

export const listarPlantasBasico = async (req: Request, res: Response) => {
  const usuarioId = parseInt(req.params.usuarioId ?? "0");
  if (isNaN(usuarioId) || usuarioId <= 0) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    const plantas = await PlantaModel.findAll({
      attributes: ["planta_nombre_comun", "planta_ubicacion", "planta_foto"],
      where: { planta_usuario_id: usuarioId },
    });

    res.json({ plantas });
  } catch (error) {
    console.error("Error al listar plantas:", error);
    res.status(500).json({ error: "Error al obtener plantas" });
  }
};