import { Escolha, Interessado, Bicicleta } from '../models/index.js';
import { calcularQuadroPorAltura } from './interessadoController.js';

export async function registrarEscolha(req, res) {
    try {
        const { id_interessado, id_bicicleta, data_escolha } = req.body;

        if (!id_interessado || !id_bicicleta) {
            return res.status(400).json({ erro: "Os campos 'id_interessado' e 'id_bicicleta' são obrigatórios." });
        }

        const interessado = await Interessado.findByPk(id_interessado);
        if (!interessado) {
            return res.status(404).json({ erro: "Interessado não encontrado." });
        }

        const bicicleta = await Bicicleta.findByPk(id_bicicleta);
        if (!bicicleta) {
            return res.status(404).json({ erro: "Bicicleta não encontrada." });
        }

        if (!bicicleta.disponivel) {
            return res.status(400).json({ erro: "A bicicleta escolhida não está disponível." });
        }

        const quadroPermitido = calcularQuadroPorAltura(interessado.altura_interessado);
        if (!quadroPermitido || Number(bicicleta.quadro_bicicleta) !== quadroPermitido) {
            return res.status(422).json({
                erro: `Incompatibilidade de quadro: para altura ${interessado.altura_interessado}m, o quadro permitido é ${quadroPermitido}'', mas a bicicleta selecionada tem quadro ${bicicleta.quadro_bicicleta}''.`,
            });
        }

        const novaEscolha = await Escolha.create({
            id_interessado,
            id_bicicleta,
            data_escolha: data_escolha || new Date(),
        });
        
        return res.status(201).json({
            mensagem: "Escolha registrada com sucesso.",
            escolha: novaEscolha,
        });
    } catch (error) {
        console.error("Erro ao registrar escolha:", error);
        return res.status(500).json({ erro: "Ocorreu um erro ao registrar a escolha." });
    }
}

export async function listarEscolhas(req, res) {
    try {
        const escolhas = await Escolha.findAll({
            include: [
                { model: Interessado, as: 'interessado', attributes: ['id_interessado', 'nome_interessado','fone_interessado','email_interessado', 'altura_interessado', 'quadro_recomendado'] },
                { model: Bicicleta, as: 'bicicleta', attributes: ['id_bicicleta', 'quadro_bicicleta', 'cor_bicicleta', 'disponivel'] },
            ],
        });

        return res.status(200).json(escolhas);
    } catch (error) {
        console.error("Erro ao listar escolhas:", error);
        return res.status(500).json({ erro: "Ocorreu um erro ao listar as escolhas." });
    }
}


        

        