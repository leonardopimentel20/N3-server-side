import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Bicicleta = sequelize.define("Bicicleta", {
  id_bicicleta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quadro_bicicleta: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [[14, 16, 17]],
    },
  },
  cor_bicicleta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  disponivel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export default Bicicleta;
