import api from "../api";

import type { Resposta } from "../types";

export const chamadasRelatorio = {
    criarResposta: async (dadosResposta: Omit<Resposta, "id_Resposta" | "data_hora">): Promise<Resposta> => {
        const response = await api.post<Resposta>("/resposta/createResposta", dadosResposta)
        return response.data
    },

    //Somente altera a mensagem como lida!
    editarResposta: async (idsRespostas: Omit<Resposta[],
        "data_hora" | "conteudo" | "id_usuario" | "id_ticket" | "lida"
    >): Promise<Resposta[]> => {
        const response = await api.put<Resposta[]>(`/resposta/updateResposta`, idsRespostas)
        return response.data
    },

    listarRespostas: async (): Promise<Resposta[]> => {
        const response = await api.get<Resposta[]>("/resposta/getRespostas")
        return response.data
    },

    listarRespostaId: async () : Promise<Resposta[]> => {
        const response = await api.get<Resposta[]>(`/resposta/getNãoLidas`)
        return response.data
    },

}