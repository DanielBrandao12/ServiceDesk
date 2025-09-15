import { Request, Response } from 'express';
import { Tickets, ViewTickets } from '../models/index';
import { TicketsAttributes } from '../types/tickets';
import { sendEmail } from '../services/email/sendEMail';
import { ticketCriadoTemplate } from '../services/email/templates/ticketCriado';
import { createHistorico, deleteHistorico } from './historicoStatusController';
import { deleteResposta, getRespostaId, getViewRespostaId } from './respostasController';
import { createAnexo, deleteAnexo } from './anexoController';
import { Op } from 'sequelize';


type CreateTicketBody = Omit<
  TicketsAttributes,
  "id_ticket" | "codigo_ticket" | "data_criacao"
>;

type UpdateTicketBody = Partial<
  Omit<TicketsAttributes,"id_ticket" | "assunto" | "email" | "nome_requisitante" | "descricao" | "codigo_ticket" | "data_criacao" | "data_conclusao">
>;

const gerarCodigoTicket = (): string => {
  const dataAtual = new Date();

  // Formatar a data como yyyyMMdd
  const dia = String(dataAtual.getDate()).padStart(2, "0");
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
  const ano = dataAtual.getFullYear();
  const dataFormatada = `${ano}${mes}${dia}`;

  // Gerar um número aleatório de 3 dígitos
  const numeroAleatorio = Math.floor(100 + Math.random() * 900); // Entre 100 e 999

  // Concatenar a data formatada com o número aleatório
  const codigoTicket = `${dataFormatada}${numeroAleatorio}`;

  return codigoTicket;
};


const verificarCodigoUnico = async (codigoTicket: string): Promise<boolean> => {
  const ticketExistente = await Tickets.findOne({
    where: { codigo_ticket: codigoTicket },
  });
  return ticketExistente !== null;
};

// Função para criar o ticket com código único
export const createTickets = async (
  req: Request<{}, {}, CreateTicketBody>,
  res: Response
): Promise<Response | any> => {
  try {
    let codigo_ticket: string;

    // Gera um código até encontrar um que não existe no banco de dados
    do {
      codigo_ticket = gerarCodigoTicket();
    } while (await verificarCodigoUnico(codigo_ticket));

    const dadosTicket = req.body;

    const ticketCriado = await Tickets.create({
      codigo_ticket,
      assunto: dadosTicket.assunto,
      email: dadosTicket.email,
      nome_requisitante: dadosTicket.nome_requisitante,
      descricao: dadosTicket.descricao,
      nivel_prioridade: dadosTicket.nivel_prioridade,
      data_criacao: new Date(),
      atribuido_a: dadosTicket.atribuido_a,
      id_categoria: dadosTicket.id_categoria,
      id_usuario: dadosTicket.id_usuario,
      id_status: dadosTicket.id_status
    });

    // cria um historico sempre que o status for alterado
    // Para controle do andamento do atendimento
    if (
      ticketCriado.id_ticket !== null && ticketCriado.id_ticket !== undefined &&
      dadosTicket.id_status !== null && dadosTicket.id_status !== undefined &&
      dadosTicket.id_usuario !== null && dadosTicket.id_usuario !== undefined
    ) {
      await createHistorico(ticketCriado.id_ticket, dadosTicket.id_status, dadosTicket.id_usuario);
    }

    await sendEmail({
      to: ticketCriado.email!,
      subject: `Chamado Criado - ${ticketCriado.codigo_ticket}`,
      html: ticketCriadoTemplate(ticketCriado.codigo_ticket!),
      attachments: [
        {
          filename: "logo.png",
          path: "../backend/public/images/logo.png",
          cid: "logo",
        },
      ],
    });

    return res.status(201).json({
      message: "Ticket criado com sucesso!",
      ticketCriado,
    });
  } catch (error: any) {
    console.error("Erro ao criar ticket: ", error);

    return res.status(500).json({
      message:
        error.message || "Erro ao criar ticket, tente novamente mais tarde.",
    });
  }
};


//Função para editar ticket um ou mais de um campo
export const updateTicket = async (
  req: Request<{ id: string }, {}, UpdateTicketBody>,
  res: Response
): Promise<Response | any> => {
  try {
 
    const id  = req.params.id;
   
    // Validação básica
    if (!id) {
      return res.status(400).json({ message: "O ID do ticket é obrigatório." });
    }

    // Verificar se o ticket existe
    const ticketExistente = await Tickets.findOne({ where: { id_ticket: Number(id) } });
    if (!ticketExistente) {
      return res.status(404).json({ message: "Ticket não encontrado." });
    }

    const dadosTicket = req.body;

    // Atualizar o ticket
   await Tickets.update(dadosTicket, {
      where: { id_ticket: Number(id) },
    });

    const ticketAtualizado = await Tickets.findOne({ where: { id_ticket: Number(id) } });
    // Se o status foi alterado, cria histórico
    if (dadosTicket.id_status !== undefined && dadosTicket.id_status !== null) {
      // Supondo que id_usuario venha da requisição ou do auth (ajuste conforme sua aplicação)
      const id_usuario = ticketExistente.id_usuario;
      await createHistorico(Number(id), dadosTicket.id_status, id_usuario!);
    }

    return res.status(200).json({
      ticket: ticketAtualizado ,
      message: "Ticket alterado com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro em alterar ticket: ", error);
    return res.status(500).json({
      message:
        error.message || "Erro em alterar ticket, tente novamente mais tarde.",
    });
  }
};

export const getTickets = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const tickets = await ViewTickets.findAll({
      where: {
        status: { [Op.ne]: 'Fechado' } // Op.ne = Not Equal
      }
    });

    const ticketsComRespostas = await Promise.all(
      tickets.map(async (ticket) => {
        const respostas = await getViewRespostaId(ticket.id_ticket);
        return {
          ...ticket.dataValues,
          respostas,
        };
      })
    );
  
    return res.status(200).json(ticketsComRespostas);
  } catch (error: any) {
    console.error("Erro ao buscar tickets: ", error);

    return res.status(500).json({
      message: error.message || "Erro ao buscar tickets, tente novamente mais tarde.",
    });
  }
};


export const getTicketsId = async (req: Request<{ id: string }>, res: Response): Promise<Response | any> => {
  const { id } = req.params;
  const id_ticket = Number(id); // Garantir que seja número

  try {
    const ticket = await Tickets.findByPk(id_ticket);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket não encontrado.",
      });
    }

    const respostas = await getViewRespostaId(id_ticket);

    return res.status(200).json({
      ticket,
      respostas,
    });
  } catch (error: any) {
    console.error("Erro ao buscar ticket:", error);

    return res.status(500).json({
      message: error.message || "Erro ao buscar ticket. Tente novamente mais tarde.",
    });
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;

  try {
    const id_ticket = Number(id);

    // Verifica se o ticket existe
    const ticket = await Tickets.findOne({ where: { id_ticket } });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado." });
    }

    // Buscar respostas relacionadas
    const respostas = await getRespostaId(id_ticket)

    const idsRespostas = respostas.map((res) => res.id_resposta);

    // Apagar anexos vinculados diretamente ao ticket e respotas
    await deleteAnexo(ticket.codigo_ticket, idsRespostas);

    // Deletar respostas
    await deleteResposta(id_ticket);

    // Deletar histórico de status
    await deleteHistorico(id_ticket);

    // Deletar o próprio ticket
    await ticket.destroy();

    return res.status(200).json({
      message: "Ticket e todos os registros relacionados foram deletados com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro ao deletar ticket: ", error);
    return res.status(500).json({
      message: error.message || "Erro ao deletar ticket, tente novamente mais tarde.",
    });
  }
};

export const criarChamadoPorEmail = async (emailData:any) => {
  try {
    const { remetente, assunto, mensagem, anexos } = emailData;
    const { nome, email } = parseRemetente(remetente);

    let codigo_ticket;
    do {
      codigo_ticket = gerarCodigoTicket();
    } while (await verificarCodigoUnico(codigo_ticket));

    const ticketData = {
      idCategoria: null,
      nomeReq: nome,
      assunto: assunto || "Sem assunto",
      emailReq: email,
      descri: mensagem || "Sem conteúdo no corpo do e-mail",
      prioridade: "",
      idStatus: 1,
      atribuir: null,
      id_usuario: null,
    };

    const ticketCriado = await Tickets.create({
      codigo_ticket,
      assunto: ticketData.assunto,
      email: ticketData.emailReq,
      nome_requisitante: ticketData.nomeReq,
      descricao: ticketData.descri,
      nivel_prioridade: ticketData.prioridade,
      data_criacao: new Date(),
      atribuido_a: ticketData.atribuir,
      id_categoria: ticketData.idCategoria,
      id_usuario: ticketData.id_usuario,
      id_status: ticketData.idStatus,
    });

    createHistorico(
      ticketCriado.id_ticket,
      ticketData.idStatus,
      ticketData.id_usuario
    );
    if (Array.isArray(anexos) && anexos.length > 0) {
      console.log(ticketCriado.codigo_ticket);
      await createAnexo(ticketCriado.codigo_ticket, null, anexos);
    }
    return {
      message: "Chamado criado com sucesso!",
      ticketCriado,
    };
  } catch (error: any) {
    console.error("Erro ao criar chamado: ", error);
    return {
      message:
        error.message || "Erro ao criar chamado, tente novamente mais tarde.",
    };
  }
};


const parseRemetente = (remetente: any) => {
  const regex = /^(.*?)(?:\s<(.+?)>)?$/;
  const match = remetente.match(regex);

  if (match) {
    return {
      nome: match[1].replace(/"/g, "").trim(),
      email: match[2] || "",
    };
  }

  return { nome: "", email: "" };
};

export const getTicketPorCodigo = async (codigoTicket: string) => {
  if (!codigoTicket) return null;
  return await Tickets.findOne({ where: { codigo_ticket: codigoTicket } });
};