import api from "../api";

import type { Usuarios } from "../types";

export const chamadaLogin = {
    handleLogin:  async (dadosLogin: Omit<Usuarios, "id_usuario" | "nomeCompleto" | "email" | "perfil"> ) : Promise<Usuarios> =>{
         const response = await api.post<Usuarios>("/auth/login", dadosLogin)
        return response.data
    },

    validate: async ( ) : Promise<Usuarios> =>{
         const response = await api.get<any>("/auth/validate", )
        return response.data
    },

    handleLogout: async ( ) : Promise<any> =>{
         const response = await api.get<Usuarios>("/auth/logout")
        return response.data
    },
}