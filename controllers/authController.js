import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

export async function registrar(req, res) {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res
        .status(400)
        .json({ erro: "Login e senha são obrigatórios." });
    }

    if (String(senha).length < 6) {
      return res
        .status(400)
        .json({ erro: "A senha deve ter pelo menos 6 caracteres." });
    }

    const usuarioExistente = await Usuario.findOne({ where: { login } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Login já está em uso." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      login,
      senhaHash,
    });

    return res.status(201).json({
      mensagem: "Usuário registrado com sucesso.",
      usuario: {
        id_usuario: novoUsuario.id_usuario,
        login: novoUsuario.login,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
}

export async function login(req, res) {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ erro: "Login e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({ where: { login } });
    if (!usuario) {
      return res.status(401).json({ erro: "Login ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Login ou senha inválidos." });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, login: usuario.login },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      mensagem: "Login bem-sucedido.",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        login: usuario.login,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
}
