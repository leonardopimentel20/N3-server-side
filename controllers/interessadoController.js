import { Interessado, Bicicleta } from "../models/index.js";

export function calcularQuadroPorAltura(altura) {
  const h = Number(altura);
  if (h >= 1.5 && h <= 1.6) return 14;
  if (h > 1.6 && h <= 1.7) return 16;
  if (h > 1.7) return 17;
  return null;
}

export async function criarInteressado(req, res) {
  try {
    const {
      nome_interessado,
      fone_interessado,
      email_interessado,
      altura_interessado,
    } = req.body;

    if (
      !nome_interessado ||
      !fone_interessado ||
      !email_interessado ||
      !altura_interessado
    ) {
      return res
        .status(400)
        .json({ erro: "Todos os campos são obrigatórios." });
    }

    const quadroRecomendado = calcularQuadroPorAltura(altura_interessado);
    if (!quadroRecomendado) {
      return res
        .status(422)
        .json({ erro: "Altura mínima para escolha de bicicleta é 1,50m." });
    }

    const novoInteressado = await Interessado.create({
      nome_interessado,
      fone_interessado,
      email_interessado,
      altura_interessado: Number(altura_interessado),
      quadro_recomendado: quadroRecomendado,
    });

    return res.status(201).json(novoInteressado);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }
    console.error("Erro ao criar interessado:", error);
    return res.status(500).json({ erro: "Erro interno ao criar interessado." });
  }
}

export async function listarInteressados(req, res) {
  try {
    const interessados = await Interessado.findAll();
    return res.status(200).json(interessados);
  } catch (error) {
    console.error("Erro ao listar interessados:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao listar interessados." });
  }
}

export async function buscarBicicletasDoInteressado(req, res) {
  try {
    const { id } = req.params;
    const interessado = await Interessado.findByPk(id, {
      include: [
        {
          model: Bicicleta,
          as: "bicicletas",
          through: { attributes: ["id_escolha", "data_escolha"] },
        },
      ],
    });

    if (!interessado) {
      return res.status(404).json({ erro: "Interessado não encontrado." });
    }

    return res.status(200).json(interessado);
  } catch (error) {
    console.error("Erro ao buscar bicicletas do interessado:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao buscar bicicletas do interessado." });
  }
}

export async function atualizarInteressado(req, res) {
  try {
    const { id } = req.params;
    const {
      nome_interessado,
      fone_interessado,
      email_interessado,
      altura_interessado,
    } = req.body;

    const interessado = await Interessado.findByPk(id);
    if (!interessado) {
      return res.status(404).json({ erro: "Interessado não encontrado." });
    }

    let quadroRecomendado = interessado.quadro_recomendado;
    if (altura_interessado !== undefined) {
      quadroRecomendado = calcularQuadroPorAltura(altura_interessado);
      if (!quadroRecomendado) {
        return res
          .status(422)
          .json({ erro: "Altura mínima para escolha de bicicleta é 1,50m." });
      }
    }

    await interessado.update({
      nome_interessado: nome_interessado ?? interessado.nome_interessado,
      fone_interessado: fone_interessado ?? interessado.fone_interessado,
      email_interessado: email_interessado ?? interessado.email_interessado,
      altura_interessado:
        altura_interessado !== undefined
          ? Number(altura_interessado)
          : interessado.altura_interessado,
      quadro_recomendado: quadroRecomendado,
    });

    return res.status(200).json(interessado);
  } catch (error) {
    console.error("Erro ao atualizar interessado:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao atualizar interessado." });
  }
}

export async function deletarInteressado(req, res) {
  try {
    const { id } = req.params;
    const interessado = await Interessado.findByPk(id);

    if (!interessado) {
      return res.status(404).json({ erro: "Interessado não encontrado." });
    }

    await interessado.destroy();
    return res
      .status(200)
      .json({ mensagem: "Interessado deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar interessado:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao deletar interessado." });
  }
}
