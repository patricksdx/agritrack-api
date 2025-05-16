import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db";

export class UsuarioModel extends Model {}

UsuarioModel.init(
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["usuario_email"],
      },
    ],
  }
);
