import api from "../api";

import type { Resposta } from "../types";

export const chamadasRespostas = {
    criarResposta: async (dadosResposta: Omit<Resposta, "id_Resposta" | "data_hora">): Promise<Resposta> => {
        const response = await api.post<Resposta>("/respostas/createResposta", dadosResposta)
        return response.data
    },

    //Somente altera a mensagem como lida!
    editarResposta: async (idResposta: number): Promise<Resposta> => {

        const response = await api.put<Resposta>(`/respostas/updateResposta`, {id: idResposta})
        return response.data
    },

    listarRespostas: async (): Promise<Resposta[]> => {
        const response = await api.get<Resposta[]>("/respostas/getRespostas")
        return response.data
    },

    listarRespostaId: async () : Promise<Resposta[]> => {
        const response = await api.get<Resposta[]>(`/respostas/getNãoLidas`)
        return response.data
    },

}