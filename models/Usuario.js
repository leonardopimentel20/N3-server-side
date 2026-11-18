import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    login: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    senhaHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
});

export default Usuario;