import api from "../api";

import type { Usuarios } from "../types";

export const chamadasUsers = {
    criarUsuario: async (dadosUser: Omit<Usuarios, "id_usuario">) : Promise<Usuarios> =>{
        const response = await api.post<Usuarios>("/usuarios/createUser", dadosUser)
        return response.data
    },

    editarUsuario: async (dadosUser: Omit<Usuarios, "nome_usuario" | "email">) : Promise<Usuarios> =>{
        const {id_usuario, ...dadosUpdate} = dadosUser
        const response = await api.put<Usuarios>(`/usuarios/updateUser/${id_usuario}`, dadosUpdate)
        return response.data
    },

    listarUsuarios: async () : Promise<Usuarios[]> =>{
        const response = await api.get<Usuarios[]>("/usuarios/")
        return response.data
    },
    
    listarUsuario: async (id: number) : Promise<Usuarios> =>{
        const response = await api.get<Usuarios>(`/usuarios/${id}`)
        return response.data
    },
}