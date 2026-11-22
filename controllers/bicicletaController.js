import { Bicicleta } from "../models/index.js";

export async function criarBicicleta(req, res) {
  try {
    const { quadro_bicicleta, cor_bicicleta } = req.body;

    if (!quadro_bicicleta || !cor_bicicleta) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const quadrosPermitidos = [14, 16, 17];
    if (!quadrosPermitidos.includes(Number(quadro_bicicleta))) {
      return res
        .status(400)
        .json({ error: "O quadro da bicicleta deve ser 14, 16 ou 17." });
    }

    const novaBicicleta = await Bicicleta.create({
      quadro_bicicleta: Number(quadro_bicicleta),
      cor_bicicleta,
    });

    res.status(201).json(novaBicicleta);
  } catch (error) {
    console.error("Erro ao criar bicicleta:", error);
    res.status(500).json({ error: "Erro ao criar bicicleta." });
  }
}

export async function listarBicicletas(req, res) {
  try {
    const { quadro } = req.query;
    const filtro = {};

    if (quadro) {
      filtro.quadro_bicicleta = Number(quadro);
    }

    const bicicletas = await Bicicleta.findAll({ where: filtro });
    return res.status(200).json(bicicletas);
  } catch (error) {
    console.error("Erro ao listar bicicletas:", error);
    return res.status(500).json({ error: "Erro ao listar bicicletas." });
  }
}

export async function buscarBicicletaPorCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const bicicleta = await Bicicleta.findByPk(codigo);

    if (!bicicleta) {
      return res.status(404).json({ error: "Bicicleta não encontrada." });
    }

    return res.status(200).json(bicicleta);
  } catch (error) {
    console.error("Erro ao buscar bicicleta por código:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar bicicleta por código." });
  }
}

export async function atualizarBicicleta(req, res) {
  try {
    const { codigo } = req.params;
    const { quadro_bicicleta, cor_bicicleta, disponivel } = req.body;

    const bicicleta = await Bicicleta.findByPk(codigo);
    if (!bicicleta) {
      return res.status(404).json({ error: "Bicicleta não encontrada." });
    }

    if (quadro_bicicleta && ![14, 16, 17].includes(Number(quadro_bicicleta))) {
      return res
        .status(400)
        .json({ error: "O quadro da bicicleta deve ser 14, 16 ou 17." });
    }

    await bicicleta.update({
      quadro_bicicleta: quadro_bicicleta ? Number(quadro_bicicleta) : bicicleta.quadro_bicicleta,
      cor_bicicleta: cor_bicicleta ?? bicicleta.cor_bicicleta,
      disponivel: disponivel !== undefined ? disponivel : bicicleta.disponivel,
    });

    return res.status(200).json(bicicleta);
  } catch (error) {
    console.error("Erro ao atualizar bicicleta:", error);
    return res.status(500).json({ error: "Erro ao atualizar bicicleta." });
  }
}

export async function deletarBicicleta(req, res) {
  try {
    const { codigo } = req.params;
    const bicicleta = await Bicicleta.findByPk(codigo);
    
    if (!bicicleta) {
      return res.status(404).json({ error: "Bicicleta não encontrada." });
    }

    await bicicleta.destroy();
    return res.status(200).json({ message: "Bicicleta deletada com sucesso." });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Não é possível deletar a bicicleta, pois ela está associada a um empréstimo.",
      });
    }
    console.error("Erro ao deletar bicicleta:", error);
    return res.status(500).json({ error: "Erro ao deletar bicicleta." });
  }
}