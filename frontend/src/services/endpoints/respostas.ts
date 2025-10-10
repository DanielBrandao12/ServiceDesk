import api from "../api";

import type { Resposta } from "../types";

export const chamadasRespostas = {
    criarResposta: async (dadosResposta: FormData,): Promise<Resposta | any> => {
        console.log(dadosResposta)
        const response = await api.post<Resposta>("/respostas/createResposta", dadosResposta, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
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