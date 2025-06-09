import api from "../api";

import type { Categoria } from "../types";

export const chamadasCategoria = {
    criarCategoria: async (dadosCategoria: Omit<Categoria, "id_categoria">) : Promise<Categoria> =>{
        const response = await api.post<Categoria>("/categoria/createCategory", dadosCategoria)
        return response.data
    },

    editarCategoria: async (dadosCategoria: Promise<Categoria>) =>{
        const response = await api.put<Categoria>(`/categoria/editCategory`, dadosCategoria)
        return response.data
    },

    listarCategorias: async () : Promise<Categoria[]> =>{
        const response = await api.get<Categoria[]>("/categoria/")
        return response.data
    },
    
    listarCategoriaId: async (id: number) : Promise<Categoria> =>{
        const response = await api.get<Categoria>(`/categoria/${id}`)
        return response.data
    },

    deletarCategoria: async (id: number) : Promise<Categoria> =>{
        const response = await api.delete<Categoria>(`/categoria/deleteCategory/${id}`)
        return response.data
    },
}