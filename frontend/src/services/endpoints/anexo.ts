import api from "../api";

import type { Anexo } from "../types";

export const chamadasAnexo = {
    //Busca anexos relacionados a um ticket ou resposta
    listarAnexos: async (id: number) : Promise<Anexo> =>{
        const response = await api.get<Anexo>(`/anexo/${id}`)
        return response.data
    },
    // Faz o download de um único anexo pelo ID
    listarCategoriaId: async (id: number) : Promise<Anexo> =>{
        const response = await api.get<Anexo>(`/anexo/getAnexo/${id}`)
        return response.data
    },
}