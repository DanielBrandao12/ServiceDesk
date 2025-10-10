import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Anexos } from '../models/index';// Certifique-se que esse import esteja tipado corretamente


export const getAnexoId = async (req: Request, res: Response): Promise<Response | any> => {
  const { id  } = req.params;
    

  try {
    const anexos = await Anexos.findAll({
      where: {
        [Op.or]: [{ ticket_id: id }, { resposta_id: id }]
      }
    });

    if (anexos.length === 0) {
      return res.json({ message: 'Anexos não encontrados.' });
    }

    return res.status(200).json(anexos);
  } catch (error: any) {
    return res.status(500).json({ message: 'Erro ao buscar anexos.', error: error.message });
  }
};

export const getAnexos = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;

  try {
    const anexo = await Anexos.findByPk(id);

    if (!anexo) {
      return res.status(404).json({ error: 'Anexo não encontrado' });
    }

    const { arquivo, tipo, nome } = anexo;

    res.setHeader('Content-Type', tipo);
    res.setHeader('Content-Disposition', `attachment; filename="${nome}"`);
    res.setHeader('Content-Length', arquivo.length);
    res.send(arquivo);
  } catch (error) {
    console.error('Erro ao buscar anexo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteAnexo = async (codigoTicket: string | any, idsRespostas: number[] | any): Promise<{ success: boolean; message: string }> => {
  try {

    if(codigoTicket){
      await Anexos.destroy({
        where: { ticket_id: codigoTicket },
      });

    }
    if(idsRespostas){
       await Anexos.destroy({
        where: { resposta_id: idsRespostas },
      });
    }

    return {
      success: true,
      message: "Anexos deletados com sucesso.",
    };
  } catch (error: any) {
    console.error("Erro ao deletar anexos: ", error);

    return {
      success: false,
      message: error.message || "Erro ao deletar anexos.",
    };
  }
};

export const createAnexo = async (idTicket: any, idResposta: number | null, dadosAnexo: any[]) => {
  try {
    if (!idTicket && !idResposta) {
      console.warn("Nenhum ID válido fornecido para anexar arquivos.");
      return;
    }

    if (!Array.isArray(dadosAnexo) || dadosAnexo.length === 0) {
      console.warn("Nenhum anexo válido para salvar.");
      return;
    }

    const anexosPromises = dadosAnexo.map((anexo) => {
      return Anexos.create({
        nome: anexo.nome,
        tipo: anexo.tipo,
        arquivo: anexo.arquivo,
        ticket_id: idTicket || null,
        resposta_id: idResposta || null,
      });
    });

    const anexosCriados = await Promise.all(anexosPromises);
    console.log("Anexos criados com sucesso:", anexosCriados);
    return anexosCriados;
  } catch (error) {
    console.error("Erro ao criar anexos:", error);
    throw new Error("Erro ao criar anexos");
  }
};

export const inserirAnexo = async (req: Request, res: Response) : Promise<any> => {
  try {
    const {  idResposta } = req.body;
    const arquivos = req.files as Express.Multer.File[];

    console.log("Recebendo anexos:", arquivos);

    if (!arquivos || arquivos.length === 0) {
      return res.status(400).json({ mensagem: "Nenhum arquivo recebido." });
    }

    const dadosAnexo = arquivos.map((file) => ({
      nome: file.originalname,
      tipo: file.mimetype,
      arquivo: file.buffer, // se estiver salvando em blob
    }));

    const anexosCriados = await createAnexo(null,idResposta, dadosAnexo);

    return res.status(201).json({
      mensagem: "Anexos criados com sucesso!",
      anexos: anexosCriados,
    });
  } catch (error) {
    console.error("Erro ao inserir anexos:", error);
    return res.status(500).json({ mensagem: "Erro ao inserir anexos." });
  }
};