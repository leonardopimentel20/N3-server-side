import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Interessado = sequelize.define('Interessado', {
    id_interessado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_interessado: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fone_interessado: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    email_interessado: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    altura_interessado: {
        type: DataTypes. DECIMAL(3, 2),
        allowNull: false,
    },
    quadro_recomendado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Interessado;