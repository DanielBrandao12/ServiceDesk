import { Request, Response } from 'express';
import { Anotacao } from '../models/anotacao';
import { Usuarios } from '../models';



export const createAnotacao = async (req: Request, res: Response): Promise<Response | any> => {
  try {

    const { id_ticket, id_usuario, descricao } = req.body

    console.log(id_ticket, id_usuario, descricao)
    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ mensagem: "Descrição é obrigatória." });
    }
    const anotacaoCriada = await Anotacao.create({
      id_ticket,
      id_usuario,
      descricao,
      data_hora: new Date(),
    });

    console.log("Anotações criadas com sucesso:", anotacaoCriada);
    return res.status(201).json({
      message: "Anotação criada com sucesso!",
      anotacaoCriada,
    });
  } catch (error) {
    console.error("Erro ao criar anotação:", error);
    throw new Error("Erro ao criar anotação");
  }
};

export const getAnotacaoId = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;

  try {
    const anotacoes = await Anotacao.findAll({
      where: {
        id_ticket: id
      }
    });

    if (anotacoes.length === 0) {
      return res.json({ message: 'Anotações não encontradas.' });
    }

    // Mapeia as anotações e adiciona o nome do usuário
    const anotacoesComUsuario = await Promise.all(
      anotacoes.map(async (anotacao: any) => {
        const user = await getUserId(anotacao.id_usuario);
        return {
          ...anotacao.dataValues,
          nome_usuario: user?.nome_usuario || 'Usuário não encontrado'
        };
      })
    );

    return res.status(200).json(anotacoesComUsuario);
  } catch (error: any) {
    return res.status(500).json({ message: 'Erro ao buscar anotações.', error: error.message });
  }
};


// Função auxiliar para buscar usuário
const getUserId = async (id: number) => {
  try {
    const user = await Usuarios.findByPk(id);
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};
