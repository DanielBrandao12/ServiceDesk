import api from "../api";
import type { Ticket, TicketView, MensagemRetorno } from "../types";

export const ChamadasTickets = {

  listarTickets: async (): Promise<TicketView[]> => {
    const response = await api.get<TicketView[]>("/tickets/");
    return response.data;
  },

  listarTicket: async (id: number): Promise<TicketView> => {
    const response = await api.get<TicketView>(`/tickets/${id}`);
    return response.data;
  },

  criarTicket: async (dadosTicket: Omit<Ticket, "id_ticket" | "codigo_ticket" | "data_criacao">): Promise<TicketView> => {
    const response = await api.post<TicketView>("/tickets/createTicket", dadosTicket)
    return response.data
  },

  editarTicket: async (
    dadosTicket: Omit<
      Ticket,
      "assunto" | "email" | "nome_requisitante" | "descricao" | "codigo_ticket" | "data_criacao"
    >
  ): Promise<Ticket> => {
    const response = await api.put<Ticket>("/tickets/updateTicket/", dadosTicket);
    return response.data;
  },

  deletarTicket: async (id: number): Promise<MensagemRetorno> => {
    const response = await api.delete<MensagemRetorno>(`/tickets/delete/${id}`);
    return response.data;
  }

};

