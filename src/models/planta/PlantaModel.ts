import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db";

export class PlantaModel extends Model {
  planta_id!: number;
  planta_nombre_comun!: string;
  planta_descripcion?: string;
  planta_ubicacion?: string;
  planta_latitud?: number;
  planta_longitud?: number;
  planta_fecha_adquisicion?: string;
  planta_foto?: string;
  planta_humedad?: number;
  planta_humedad_clima?: number;
  planta_ultima_fecha_riego?: Date;
  planta_luz?: number;
  planta_temperatura?: number;
  planta_usuario_id!: number;
}

PlantaModel.init(
  {
    planta_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    planta_nombre_comun: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    planta_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    planta_ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    planta_latitud: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    planta_longitud: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    planta_fecha_adquisicion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    planta_foto:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    planta_humedad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    planta_humedad_clima: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    planta_ultima_fecha_riego: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    planta_luz: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    planta_temperatura: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    planta_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
  },
  {
    sequelize,
    modelName: "Planta",
    tableName: "plantas",
    timestamps: false,
    indexes: [
      {
        fields: ["planta_usuario_id"],
      },
    ],
  }
);
