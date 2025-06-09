
export interface AnexosAttributes {
  id: number;
  nome: string;
  tipo: string;
  arquivo: Buffer;
  ticket_id?: string | null;
  resposta_id?: number | null;
  criado_em?: Date;
}
