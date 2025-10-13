
export interface AnotacaoAttributes {
  id: number;
  descricao: string;
  data_hora: Date | null;
  id_ticket?: number | null;
  id_usuario?: number | null;

}
