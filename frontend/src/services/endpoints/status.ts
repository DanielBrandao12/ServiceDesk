import api from "../api";

import type { Status } from "../types";

export const chamadasStatus = {
    criarStatus: async (dadosStatus: Omit<Status, "id_status">) : Promise<Status> =>{
        const response = await api.post<Status>("/status/createStatus", dadosStatus)
        return response.data
    },

    editarStatus: async (dadosStatus: Promise<Status>) =>{
       
        const response = await api.put<Status>(`/status/updateStatus`, dadosStatus)
        return response.data
    },

    listarStatus: async () : Promise<Status[]> =>{
        const response = await api.get<Status[]>("/status/")
        return response.data
    },
    
    listarStatusId: async (id: number) : Promise<Status> =>{
        const response = await api.get<Status>(`/status/${id}`)
        return response.data
    },

    deletarStatus: async (id: number) : Promise<Status> =>{
        const response = await api.delete<Status>(`/status/deleteStatus/${id}`)
        return response.data
    },
}