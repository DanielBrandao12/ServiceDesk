import { Request, Response } from 'express';
import { Usuarios } from '../models/index'; // ajuste o caminho conforme seu projeto
import bcrypt from 'bcrypt';
import { UsuariosAttributes } from '../types/usuarios';

// Para criação: use Partial e omita o id_usuario porque é auto-incremento
type CreateUserBody = Omit<UsuariosAttributes, 'id_usuario' | 'senha_hash'> & { senha: string };

// Para atualização, todos opcionais
type UpdateUserBody = Partial<Omit<UsuariosAttributes, 'id_usuario' | 'senha_hash'>> & { senha?: string };

// Função auxiliar para verificação de duplicidade de e-mail e nome de usuário
const checkDuplicate = async (
  email: string,
  nome_usuario: string,
  id: number | null = null
): Promise<{ emailExists: boolean; usernameExists: boolean }> => {
  if (id) {
    const user = await Usuarios.findByPk(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
  }

  const existingEmail = await Usuarios.findOne({ where: { email } });
  if (existingEmail) {
    return { emailExists: true, usernameExists: false };
  }

  const existingUsername = await Usuarios.findOne({ where: { nome_usuario } });
  if (existingUsername) {
    return { emailExists: false, usernameExists: true };
  }

  return { emailExists: false, usernameExists: false };
};

// Função auxiliar para hash da senha
const hashPassword = async (senha: string): Promise<string> => {
  return bcrypt.hash(senha, 10);
};

// Get todos os usuários
const getUserAll = async (req: Request, res: Response | any) => {
  try {
    const users = await Usuarios.findAll({
      attributes: ['id_usuario', 'nome_completo', 'email', 'nome_usuario'],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Get usuário por ID
const getUserId = async (req: Request, res: Response | any) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID não fornecido.' });
    }

    const user = await Usuarios.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({
      message: 'Usuário encontrado com sucesso!',
      nomeUser: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Criação de usuário
const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response | any) => {
  try {
    const { nome_completo, nome_usuario, email, senha, perfil } = req.body;

    if (!nome_completo || !nome_usuario || !email || !senha || !perfil) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const { emailExists, usernameExists } = await checkDuplicate(email, nome_usuario);
    if (emailExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }
    if (usernameExists) {
      return res.status(400).json({ message: 'Nome de usuário já cadastrado.' });
    }

    const senhaBcrypt = await hashPassword(senha);

    const newUser = await Usuarios.create({
      nome_completo,
      nome_usuario,
      email,
      senha_hash: senhaBcrypt,
      perfil,
    });

    const { senha_hash, ...userWithoutPassword } = newUser.toJSON();

    return res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Erro ao criar o usuário: ', error);
    return res.status(500).json({
      message: error.message || 'Erro ao criar usuário, tente novamente mais tarde.',
    });
  }
};

// Atualização de usuário
const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response | any
) => {
  try {
    const { id } = req.params;
    const { nome_completo, senha, perfil } = req.body;

    const user = await Usuarios.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza dados (se fornecidos)
    user.nome_completo = nome_completo ?? user.nome_completo;
    user.perfil = perfil ?? user.perfil;

    if (senha) {
      user.senha_hash = await hashPassword(senha);
    }

    await user.save();

    const { senha_hash, ...updatedUser } = user.toJSON();

    return res.status(200).json({
      message: 'Usuário atualizado com sucesso!',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar o usuário: ', error);
    return res.status(500).json({
      message: error.message || 'Erro ao atualizar usuário, tente novamente mais tarde.',
    });
  }
};

export { createUser, updateUser, getUserId, getUserAll };
