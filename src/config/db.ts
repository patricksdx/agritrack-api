import { Sequelize } from "sequelize";

const dbname = process.env.DB_NAME;
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS || "";
const dbhost = process.env.DB_HOST;

if (!dbname || !dbuser || !dbhost) {
  throw new Error("Falta la configuración de la base de datos.");
}

export const sequelize = new Sequelize(dbname, dbuser, dbpass, { 
  host: dbhost,
  dialect: "mysql",
  logging: false
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
};