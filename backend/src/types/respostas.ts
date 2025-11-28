
export interface RespostasAttributes {
  id_resposta: number;
  data_hora?: Date | null;
  conteudo?: string | null;
  id_usuario?: number | null;
  id_ticket?: number | null;
  lida?: boolean | null;


}


export interface ViewRespostasAttributes extends RespostasAttributes {
     nome_usuario?: string | null;
  email?: string | null;
  nome_requisitante?: string | null;
}