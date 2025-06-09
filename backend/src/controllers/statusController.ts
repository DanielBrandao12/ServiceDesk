import { Request, Response } from "express";
import { Status } from "../models/index";
import { StatusAttributes } from "../types/status";

// Tipagem para requisições que não precisam de ID
type StatusBody = Omit<StatusAttributes, "id_status">;

// Tipagem para requisições que exigem o ID
type StatusWithId = Pick<StatusAttributes, "id_status" | "ativo">;

export const getStatus = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const listaStatus = await Status.findAll();
    return res.status(200).json(listaStatus);
  } catch (error: any) {
    console.error("Erro ao buscar status: ", error);
    return res.status(500).json({
      message: error.message || "Erro ao buscar status, tente novamente mais tarde.",
    });
  }
};

export const getStatusId = async (req: Request<{ id: string }>, res: Response): Promise<Response | any> => {
  try {
    const status = await Status.findByPk(req.params.id);
    return res.status(200).json(status);
  } catch (error: any) {
    console.error("Erro ao buscar status por ID: ", error);
    return res.status(500).json({
      message: error.message || "Erro ao buscar status por ID, tente novamente mais tarde.",
    });
  }
};

export const createStatus = async (
  req: Request<{}, {}, StatusBody>,
  res: Response
): Promise<Response | any> => {
  try {
    const { nome, ativo } = req.body;
    const statusCriado = await Status.create({ nome, ativo });
    return res.status(201).json(statusCriado);
  } catch (error: any) {
    console.error("Erro ao criar status: ", error);
    return res.status(500).json({
      message: error.message || "Erro ao criar status, tente novamente mais tarde.",
    });
  }
};

export const updateStatus = async (
  req: Request<{}, {}, StatusAttributes>,
  res: Response
): Promise<Response | any> => {
  try {
    const { id_status, nome, ativo } = req.body;
    const statusEditado = await Status.update(
      { nome, ativo },
      { where: { id_status } }
    );
    return res.status(201).json({
      message: "Status editado com sucesso",
      statusEditado,
    });
  } catch (error: any) {
    console.error("Erro ao editar status: ", error);
    return res.status(500).json({
      message: "Erro ao editar item",
      error: error.message,
    });
  }
};

export const deleteStatus = async (
  req: Request<{}, {}, StatusWithId>,
  res: Response
): Promise<Response | any> => {
  try {
    const { id_status, ativo } = req.body;

    if (!ativo) {
      const statusRemovido = await Status.destroy({ where: { id_status } });

      if (statusRemovido) {
        return res.status(200).json({
          message: "Status removido com sucesso",
        });
      } else {
        return res.status(404).json({
          message: "Status não encontrado",
        });
      }
    } else {
      return res.status(400).json({
        message: "Status em uso, não é possível excluir.",
      });
    }
  } catch (error: any) {
    console.error("Erro ao excluir status: ", error);
    return res.status(500).json({
      message: error.message || "Erro ao excluir status, tente novamente mais tarde.",
    });
  }
};
