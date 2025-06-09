
import { Request, Response } from 'express';
import {  viewRespostas, Respostas } from '../models/index'; // certifique-se de importar corretamente
import { ViewRespostasAttributes, RespostasAttributes } from '../types/respostas'; // ajuste o nome conforme seu projeto
import { enviarRespostaAutomatica } from './emailController';
import { createAnexo } from './anexoController';



type CreateRespostaBody = Omit<RespostasAttributes, "id_resposta">;

interface Conteudo {
  codigoTicket: string,
  remetente: string,
}

interface MarcarComoLidaBody {
  ids: number[];
}


export const getViewRespostaId = async (id_ticket: number): Promise<ViewRespostasAttributes[]> => {
  try {
    const respostas = await viewRespostas.findAll({
      where: { id_ticket },
    });

    return respostas;
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    throw new Error("Erro ao buscar respostas. Tente novamente mais tarde.");
  }
};

export const getRespostaId = async (id_ticket: number): Promise<RespostasAttributes[]> => {
  try {
    const respostas = await Respostas.findAll({
      where: { id_ticket },
      attributes: ["id_resposta"],
    });

    return respostas;
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    throw new Error("Erro ao buscar respostas. Tente novamente mais tarde.");
  }
};

export const getRespostasNaoLidas = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const respostasNaoLidas: RespostasAttributes[] = await Respostas.findAll({
      where: { lida: false },
    });

    return res.status(200).json(respostasNaoLidas);
  } catch (error: any) {
    console.error("Erro ao buscar respostas não lidas:", error);

    return res.status(500).json({
      message:
        error.message || "Erro ao buscar respostas não lidas, tente novamente mais tarde.",
    });
  }
};

export const getResposta = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const { id_ticket } = req.body;


    const respostasTicket: RespostasAttributes[] = await Respostas.findAll({
      where: { id_ticket },
    });

    return res.status(200).json(respostasTicket);
  } catch (error: any) {
    console.error("Não encontrado: ", error);

    return res.status(500).json({
      message: error.message || "Não encontrado, tente novamente mais tarde.",
    });
  }
};

export const createResposta = async (
  req: Request<{}, {}, CreateRespostaBody & Conteudo>,
  res: Response
): Promise<Response | any> => {
  try {
    const { id_ticket, id_usuario, conteudo, codigoTicket, remetente } = req.body;

    const respostaCriada = await Respostas.create({
      data_hora: new Date(),
      conteudo,
      id_usuario,
      id_ticket,
      lida: true,
    });

   if (!conteudo || !codigoTicket || !remetente) {
  return res.status(400).json({ message: "Dados obrigatórios ausentes." });
}

    enviarRespostaAutomatica(remetente, codigoTicket, conteudo);

    return res.status(201).json({
      message: "Resposta criada com sucesso!",
      respostaCriada,
    });
  } catch (error: any) {
    console.error("Erro ao criar resposta: ", error);

    return res.status(500).json({
      message: error.message || "Erro ao criar resposta, tente novamente mais tarde.",
    });
  }
};


export const marcarComoLida = async (
  req: Request<{}, {}, MarcarComoLidaBody>,
  res: Response
): Promise<Response | any> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "IDs das respostas são obrigatórios." });
    }

    const [linhasAtualizadas] = await Respostas.update(
      { lida: true },
      {
        where: { id_resposta: ids },
      }
    );

    if (linhasAtualizadas === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma resposta encontrada para atualizar." });
    }

    return res
      .status(200)
      .json({ message: "Respostas marcadas como lidas com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao marcar como lida: ", error);
    return res.status(500).json({
      message:
        error.message ||
        "Erro ao marcar como lida, tente novamente mais tarde.",
    });
  }
};


export const deleteResposta = async (idTicket: number): Promise<{ success: boolean; message: string }> => {
  try {

        await Respostas.destroy({
            where: {id_ticket: idTicket}
        })

    return {
      success: true,
      message: "Respostas deletadas com sucesso.",
    };
  } catch (error: any) {
    console.error("Erro ao deletar respostas: ", error);

    return {
      success: false,
      message: error.message || "Erro ao deletar respostas.",
    };
  }
};

export const createRespostaAuto = async (id_ticket: number, descricao: string, anexo: any) => {
  try {
    const respostaCriada = await Respostas.create({
      data_hora: new Date(),
      conteudo: descricao,
      id_usuario: null,
      id_ticket,
    });

    createAnexo(null, respostaCriada.id_resposta, anexo);
  } catch (error) {
    // Log de erro para depuração
    console.error("Erro ao criar resposta: ", error);
  }
};

