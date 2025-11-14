import api from "../api";

export const ChamadaRelatorio = {
    gerarRelatorio: async (dadosRelatorio: any): Promise<any> => {
       
        const response = await api.post<any>("/relatorio/", dadosRelatorio );
        return response.data
    }
}