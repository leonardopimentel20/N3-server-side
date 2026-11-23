import express from "express";
import authRouter from "./routers/authRouter.js";
import { sequelize } from "./models/index.js";
import cors from "cors";
import dotenv from "dotenv";
import interessadoRouter from "./routers/interessadoRouter.js";
import bicicletaRouter from "./routers/bicicletaRouter.js";
import escolhaRouter from "./routers/escolhaRouter.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 


app.use("/auth", authRouter);
app.use("/interessados", interessadoRouter);
app.use("/bicicletas", bicicletaRouter);
app.use("/escolhas", escolhaRouter);

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    await sequelize.sync();
    console.log("Modelos sincronizados com o banco de dados.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

iniciarServidor();