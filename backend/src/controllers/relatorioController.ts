import { Request, Response } from 'express';
import { Usuarios, ViewTickets } from '../models/index';
import { Op } from 'sequelize';

export const getRelatorio = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { intervalo, tipoRelatorio, dateStart, dateEnd } = req.body;

    // Validação de parâmetros
    if (!tipoRelatorio || (!intervalo && (!dateStart || !dateEnd))) {
      return res.status(400).json({ erro: "Parâmetros inválidos" });
    }

    let whereClause: Record<string, any> = {};

    //Filtro por data de criação (com timezone ajustado)
    if (dateStart && dateEnd) {
      const inicio = new Date(dateStart as string);
      inicio.setHours(0, 0, 0, 0);

      const fim = new Date(dateEnd as string);
      fim.setHours(23, 59, 59, 999);

      whereClause.data_criacao = { [Op.between]: [inicio, fim] };
    }

    //Filtro por intervalo de tempo (aplicado apenas se não houver data manual)
    if (!dateStart && !dateEnd && intervalo) {
      const agora = new Date();

      switch (intervalo) {
        case "hoje":
          const inicioHoje = new Date();
          inicioHoje.setHours(0, 0, 0, 0);
          whereClause.data_criacao = { [Op.gte]: inicioHoje };
          break;

        case "semana":
          const diaSemana = agora.getDay(); // 0 = domingo
          const inicioSemana = new Date(agora);
          inicioSemana.setDate(agora.getDate() - diaSemana);
          inicioSemana.setHours(0, 0, 0, 0);
          whereClause.data_criacao = { [Op.gte]: inicioSemana };
          break;

        case "mes":
          const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
          whereClause.data_criacao = { [Op.gte]: inicioMes };
          break;

        case "ano":
          const inicioAno = new Date(agora.getFullYear(), 0, 1);
          whereClause.data_criacao = { [Op.gte]: inicioAno };
          break;

        case "todos":
          // Nenhum filtro
          break;

        default:
          return res.status(400).json({ erro: "Intervalo inválido" });
      }
    }

    //  Buscar tickets conforme os filtros
    const tickets = await ViewTickets.findAll({ where: whereClause });

    if (!tickets.length) {
      return res.json({
        totalTickets: 0,
        totalGrupos: 0,
        agrupados: {},
        mensagem: "Nenhum ticket encontrado no período especificado."
      });
    }

    //Extrair IDs únicos dos técnicos atribuídos
    const idsTecnicos = [...new Set(tickets.map(t => Number(t.atribuido_a)).filter(Boolean))];

    // Buscar os nomes dos técnicos
    const usuarios = await Usuarios.findAll({
      where: { id_usuario: idsTecnicos  },
      attributes: ["id_usuario", "nome_usuario"],
    });

   const mapaUsuarios = usuarios.reduce<Record<number, string>>((acc, usuario) => {
  acc[usuario.id_usuario] = usuario.nome_usuario ?? "Sem nome";
  return acc;
}, {});

    // Adicionar o nome do técnico ao ticket
    const ticketsComUsuarios = tickets.map(ticket => ({
      ...ticket.toJSON(),
     usuarioAtribuido:
  ticket.atribuido_a != null
    ? mapaUsuarios[Number(ticket.atribuido_a)] ?? "Não atribuído"
    : "Não atribuído",
    }));

    // Agrupamento dinâmico conforme o tipo de relatório
    let agrupados: Record<string, any[]> = {};

 switch (tipoRelatorio) {
  case "Dia":
    agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
      const dataCriacao = ticket.data_criacao ? new Date(ticket.data_criacao) : new Date();
      const data = dataCriacao.toISOString().split("T")[0]; // formato AAAA-MM-DD

      if (!acc[data]) acc[data] = [];
      acc[data].push(ticket);

      return acc;
    }, {} as Record<string, any[]>);
    break;

  case "Mês":
    agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
      const dataCriacao = ticket.data_criacao ? new Date(ticket.data_criacao) : new Date();
      const mes = dataCriacao.toLocaleString("pt-BR", { month: "long", year: "numeric" });

      if (!acc[mes]) acc[mes] = [];
      acc[mes].push(ticket);

      return acc;
    }, {} as Record<string, any[]>);
    break;

      case "Técnico":
        agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
          const tecnico = ticket.usuarioAtribuido || "Não atribuído";
          acc[tecnico] = acc[tecnico] || [];
          acc[tecnico].push(ticket);
          return acc;
        }, {} as Record<string, any[]>);
        break;

      case "Categoria":
        agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
          const categoria = ticket.categorias || "Sem categoria";
          acc[categoria] = acc[categoria] || [];
          acc[categoria].push(ticket);
          return acc;
        }, {} as Record<string, any[]>);
        break;

      default:
        return res.status(400).json({ erro: "Tipo de relatório inválido" });
    }

    // Retorno final
    return res.json({
      totalTickets: tickets.length,
      totalGrupos: Object.keys(agrupados).length,
      agrupados,
    });

  } catch (error: any) {
    console.error("Erro ao buscar tickets:", error);
    return res.status(500).json({
      message: error.message || "Erro ao buscar tickets, tente novamente mais tarde.",
    });
  }
};
