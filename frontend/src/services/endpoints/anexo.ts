import api from "../api";

import type { Anexo } from "../types";

export const chamadasAnexo = {
    //Busca anexos relacionados a um ticket ou resposta
    listarAnexos: async (id: string | number) : Promise<Anexo> =>{
        const response = await api.get<Anexo>(`/anexo/${id}`)
        return response.data
    },
    // Faz o download de um único anexo pelo ID
    listarAnexoId: async (id: number) : Promise<any> =>{
        const response = await api.get<Anexo>(`/anexo/getAnexo/${id}`, {  responseType: "blob",})
       
        return response
    },
}