
export interface TicketsAttributes {
  id_ticket: number;
  codigo_ticket?: string | null;
  assunto?: string | null;
  email?: string | null;
  nome_requisitante?: string | null;
  descricao?: string | null;
  nivel_prioridade?: string | null;
  data_criacao?: Date | null;
  data_conclusao?: Date | null;
  atribuido_a?: string | null;
  id_categoria?: number | null;
  id_usuario?: number | null;
  id_status?: number | null;
}

export interface ViewTicketAttributes extends TicketsAttributes {
    status?: string | null;
    categorias?: string | null;
}
