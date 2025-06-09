import { Request, Response } from "express";
import {  HistoticoStatus } from '../models/index';



//função para criar um historico de status sempre que for criado um ticket ou se os status for alterado
export const createHistorico = async (
  id_ticket: number,
  id_status: number,
  id_usuario: number | null
): Promise<void> => {
  try {
    await HistoticoStatus.create({
      data_hora: new Date(),
      id_ticket,
      id_status,
      id_usuario,
    });
  } catch (error) {
    console.error("Erro ao criar histórico de status:", error);
    // Aqui você pode decidir se quer propagar o erro ou apenas logar
    // throw error; // caso queira parar a execução onde a função for chamada
  }
};

export const deleteHistorico = async (idTicket: number): Promise<{ success: boolean; message: string }> => {
  try {

      await HistoticoStatus.destroy({
        where: {id_ticket: idTicket}
      })

    return {
      success: true,
      message: "Historico deletado com sucesso.",
    };
  } catch (error: any) {
    console.error("Erro ao deletar Historico: ", error);

    return {
      success: false,
      message: error.message || "Erro ao deletar Historico.",
    };
  }
};

export const getHistorico = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;

  try {
    const historico = await HistoticoStatus.findAll({
      where: { id_ticket: id },
    });

    return res.status(200).json(historico);
  } catch (error: any) {
    console.error("Erro ao tentar encontrar histórico:", error);
    return res.status(500).json({
      error: error.message || "Erro ao tentar encontrar histórico.",
    });
  }
};