import sequelize from "../config/database.js";
import Bicicleta from "./Bicicleta.js";
import Escolha from "./Escolha.js";
import Interessado from "./Interessado.js";
import Usuario from "./Usuario.js";

Interessado.belongsToMany(Bicicleta, {
    through: Escolha,
    foreignKey: "id_interessado",
    otherKey: "id_bicicleta",
    as: "bicicletas",
});

Bicicleta.belongsToMany(Interessado, {
    through: Escolha,
    foreignKey: "id_bicicleta",
    otherKey: "id_interessado",
    as: "interessados",
});

Escolha.belongsTo(Interessado, { foreignKey: "id_interessado", as: "interessado" });
Escolha.belongsTo(Bicicleta, { foreignKey: "id_bicicleta", as: "bicicleta" });
Interessado.hasMany(Escolha, { foreignKey: "id_interessado", as: "escolhas" });
Bicicleta.hasMany(Escolha, { foreignKey: "id_bicicleta", as: "escolhas" });

export { sequelize, Usuario, Interessado, Bicicleta, Escolha };