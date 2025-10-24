import api from "../api";

import type { Usuarios } from "../types";

export const chamadaLogin = {
    handleLogin:  async (dadosLogin: Omit<Usuarios, "id_usuario" | "nomeCompleto" | "email" | "perfil"> ) : Promise<Usuarios> =>{
         const response = await api.post<Usuarios>("/auth/login", dadosLogin)
        return response.data
    }
}