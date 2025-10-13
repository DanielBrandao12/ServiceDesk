import api from "../api";

import type { Anotacao, Resposta } from "../types";


export const chamadasAnotacoes = {
    
    criarAnotacao: async (dadosAnotacao: Omit<Anotacao, "id" | "data_hora" | "nome_usuario">): Promise<Resposta | any> => {
        const response = await api.post<Anotacao>("/anotacao/createAnotacao", dadosAnotacao);
        return response.data
    },

    listarAnotacoes: async (id_ticket: number): Promise<Anotacao[]> => {

        const response = await api.get<Anotacao[]>(`/anotacao/${id_ticket}`);

        return response.data
    }
}