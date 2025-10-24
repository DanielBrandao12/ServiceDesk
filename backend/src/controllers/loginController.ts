import { Request, Response } from "express";
import { Usuarios } from "../models/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtKey } from "../config/secrets";
import { UsuariosAttributes } from "../types/usuarios";

type LoginPayload = {
  nome_usuario: string;
  senha: string; // o usuário envia a senha pura, não o hash
};

export const handleLogin = async (
  req: Request<{}, {}, LoginPayload>,
  res: Response
): Promise<Response | any> => {
  
  const { nome_usuario, senha } = req.body //|| {nome_usuario:'Daniel', senha:'ftcbp183'};
  if (!senha) {
    return res.status(400).json({ message: "Senha é obrigatória" });
  }

  try {
    const usuario = await Usuarios.findOne({ where: { nome_usuario } });

    if (!usuario || !usuario.senha_hash) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    const { id_usuario, nome_completo } = usuario;

    const token = jwt.sign(
      { id: id_usuario, nome_usuario, nome_completo },
      jwtKey,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    req.session.userLogged = {
      id_usuario,
      nome_usuario,
      nome_completo,
    };

    //const { senha_hash: _, ...usuarioSemSenha } = usuario.toJSON();
    return res.status(200).json({token});
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro interno ao fazer login", error: error.message });
  }
};


export const logout = (
  req: Request,
  res: Response
): void => {
  req.session.destroy((err: any) => {
    if (err) {
      res.status(500).json({ message: "Erro ao fazer logout" });
    } else {
      res.clearCookie("connect.sid", { path: "/" });
      res.clearCookie("token", { path: "/" });
      res.status(200).json({ message: "Logout realizado com sucesso" });
    }
  });
};
