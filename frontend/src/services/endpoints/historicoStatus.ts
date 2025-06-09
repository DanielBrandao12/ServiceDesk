import api from "../api";

import type { HistoricoStatus } from "../types";

export const chamadasHistorico = {

    getHistorico: async (id: number): Promise<HistoricoStatus[]> => {
        const response = await api.get<HistoricoStatus[]>(`/historicosStatus/${id}`)
        return response.data
    }
}