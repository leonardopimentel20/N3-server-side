import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Escolha = sequelize.define('escolha', {
    id_escolha: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_interessado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_bicicleta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data_escolha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

export default Escolha;
