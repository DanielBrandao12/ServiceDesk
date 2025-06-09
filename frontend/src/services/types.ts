
export interface Ticket {
    id_ticket: number;
    codigo_ticket: string;
    assunto: string;
    email: string;
    nome_requisitante: string;
    descricao: string;
    nivel_prioridade: string;
    data_criacao: string;
    atribuido_a: string;
    id_categoria: number;
    id_usuario: number;
    id_status: number;
}

export interface TicketView extends Ticket{
    status: string;
    categorias: string;
}

export interface Usuarios {
    id_usuario: number;
    nome_completo: string;
    email: string;
    senha_hash: string;
    nome_usuario: string;
    perfil: string;
}

export interface Status {
    id_status: number;
    nome: string;
    ativo: boolean;
    //id_usuario: number;
    //data_hora: string; 
}

export interface Resposta {
    id_resposta: number;
    data_hora: string;
    conteudo: string;
    id_usuario: number;
    id_ticket: number;
    lida: boolean;
}

export interface RespostaView extends Resposta {
     nome_usuario: string;
    email: string;
    nome_requisitante: string;
}

export interface Anexo {
    id: number;
    nome: string;
    tipo: string;
    arquivo: Blob;
    ticket_id: string;
    resposta_id: number;
}

export interface Categoria {
    id_categoria: number;
    nome: string;
    criado_por: string;
    status: string;
    data_criação: string;
}

export interface HistoricoStatus {
    id_historico: number;
    data_hora: string;
    id_ticket: number;
    id_status: number;
    id_usuario: number;
}


export interface MensagemRetorno {
    mensagem: string;
}