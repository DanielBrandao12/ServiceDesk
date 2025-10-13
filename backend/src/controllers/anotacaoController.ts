import { Request, Response } from 'express';
import { Anotacao } from '../models/anotacao';
export const createAnotacao = async (req: Request, res: Response) : Promise<Response | any> => {
  try {
    
    const {id_ticket, id_usuario, descricao} = req.body

   console.log(id_ticket, id_usuario, descricao)
   if (!descricao || descricao.trim() === "") {
  return res.status(400).json({ mensagem: "Descrição é obrigatória." });
}
     const anotacaoCriada = await  Anotacao.create({
            id_ticket,
            id_usuario,
            descricao,
            data_hora: new Date(),
      });
  

    
    console.log("Anexos criados com sucesso:", anotacaoCriada);
       return res.status(201).json({
      message: "Anotação criada com sucesso!",
      anotacaoCriada,
    });
  } catch (error) {
    console.error("Erro ao criar anotação:", error);
    throw new Error("Erro ao criar anotação");
  }
};