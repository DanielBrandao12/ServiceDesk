import {
  Bell,
  Filter,
  Search,
  SquareArrowLeft,
  SquareArrowRight,
} from "lucide-react";
import PaginaPadrao from "../../components/paginaPadrao";
import { useEffect, useState } from "react";
import { ChamadasTickets } from "../../services/endpoints/tickets";
import { chamadasUsers } from "../../services/endpoints/users";
import type { TicketView } from "../../services/types";
import Card from "../../components/card/card";

import { useNavigate } from "react-router-dom";

import { formatarData } from "../../utils/date";

const TicketsClose = () => {
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string[]>([]);
  const [tickets, setTickets] = useState<TicketView[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketView[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [ordenacao, setOrdenacao] = useState<string>("");
  const [busca, setBusca] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPage, setItemPage] = useState<number>(5);
  const [loading, setLoading] = useState(true);


  const indexInicio = (currentPage - 1) * itemPage;
  const indexFim = indexInicio + itemPage;
  const ticketsPaginados = filteredTickets.slice(indexInicio, indexFim);

  const navigate = useNavigate()

  useEffect(() => {

    setLoading(true);
    // Buscar tickets
    ChamadasTickets.listarTicketsClose()
      .then((res) => {
        // Para cada ticket, buscar o usuário atribuído (se houver)
        Promise.all(
          res.map(async (ticket: any) => {
            try {
              if (ticket.atribuido_a) {
                const user = await chamadasUsers.listarUsuario(
                  parseInt(ticket.atribuido_a)
                );

                return {
                  ...ticket,
                  nome_usuarioAtribuido:
                    user?.nomeUser?.nome_usuario ?? "Não atribuído",
                };
              } else {
                return {
                  ...ticket,
                  nome_usuarioAtribuido: "Não atribuído",
                };
              }
            } catch (error) {
              console.error("Erro ao buscar usuário:", error);
              return {
                ...ticket,
                nome_usuarioAtribuido: "Erro ao carregar",
              };
            }
          })
        ).then((ticketsComUsuarios) => {
          // Garantir que todos os tickets retornados são válidos
          const validTickets = ticketsComUsuarios.filter(
            (ticket): ticket is TicketView =>
              ticket !== undefined && ticket !== null
          );
    
          setTickets(validTickets);
        }).finally(() => {
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar tickets:", err);
      });
  }, []);

  const selectQtde = (qtde: number) => {
    setItemPage(qtde);
  };

  // Alterna seleção da prioridade
  const togglePrioridade = (prioridade: string) => {
    setFiltroPrioridade((prev) =>
      prev.includes(prioridade)
        ? prev.filter((item) => item !== prioridade)
        : [...prev, prioridade]
    );
  };

  // Aplica filtros com base na prioridade
  const aplicarFiltros = () => {
    let filtrados = [...tickets];

    // Busca
    if (busca.trim() !== "") {
      filtrados = filtrados.filter(
        (ticket) =>
          ticket.codigo_ticket?.toLowerCase().includes(busca.toLowerCase()) ||
          ticket.nome_requisitante
            ?.toLowerCase()
            .includes(busca.toLowerCase()) ||
          ticket.assunto?.toLowerCase().includes(busca.toLowerCase()) ||
          ticket.nome_usuarioAtribuido
            ?.toLowerCase()
            .includes(busca.toLowerCase())
      );
    }

    if (filtroPrioridade.length > 0) {
      filtrados = filtrados.filter((ticket) =>
        filtroPrioridade.includes(ticket.nivel_prioridade)
      );
    }

    if (filtroAtivo === "meus") {
      filtrados = filtrados.filter(
        (ticket) => parseInt(ticket.atribuido_a) === 1 //aqui vai ser o id do user logado
      );
    } else if (filtroAtivo === "outros") {
      filtrados = filtrados.filter(
        (ticket) =>
          parseInt(ticket.atribuido_a) && parseInt(ticket.atribuido_a) !== 1 //aqui vai ser o id do user logado
      );
    } else if (filtroAtivo === "nao_atribuidos") {
      filtrados = filtrados.filter((ticket) => !ticket.atribuido_a);
    } else if (filtroAtivo === "hoje") {
      filtrados = filtrados.filter(
        (ticket) =>
          formatarData(ticket.data_criacao) === formatarData(Date.now())
      );
    }

    setFilteredTickets(filtrados);
    setCurrentPage(1);
    setShowFilter(false);
    // Ordenação
    if (ordenacao === "mais_novo") {
      filtrados.sort(
        (a, b) =>
          new Date(b.data_criacao).getTime() -
          new Date(a.data_criacao).getTime()
      );
    } else if (ordenacao === "mais_antigo") {
      filtrados.sort(
        (a, b) =>
          new Date(a.data_criacao).getTime() -
          new Date(b.data_criacao).getTime()
      );
    }
  };

  // Reaplica filtros sempre que necessário
  useEffect(() => {
    aplicarFiltros();
  }, [tickets, filtroPrioridade, filtroAtivo, ordenacao, busca]);


  const handleTicketSelected = (idTicket: number) => {
    navigate(`/Ticket/${idTicket}`)
  }




  return (
    <PaginaPadrao>
      <div className="w-[100%] flex flex-col  gap-5 p-20 overflow-scroll">
        {/*Titulo */}
        <span className="text-titulosTabela font-bold text-xl">
          Tickets Fechados
        </span>
        {/* *** */}

        {/*Div principal */}
        <Card>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between text-gray-400">
              {/*Campo de busca */}
              <div
                className="flex flex-row items-center border border-gray-300 w-[217px] h-[36px] rounded px-2 bg-white cursor-pointer"
                title="Busque por código do ticket, solicitante, assunto ou técnico"
              >
                <input
                  type="text"
                  className="flex-grow outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                  placeholder="Pesquisar por..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
                <Search size={20} />
              </div>
              {/*Filtro */}
              <div
                onClick={() => setShowFilter(!showFilter)}
                className="relative flex flex-row items-center gap-2 cursor-pointer"
              >
                <span className="font-semibold">Filtro</span>
                <Filter size={20} />

                {showFilter && (
                  <div className="absolute left-0 top-full mt-2 w-36 sm:w-48 md:w-56 lg:w-64 bg-white border border-gray-500 rounded shadow-lg z-[999] p-3">
                    <form className="flex flex-col gap-2 text-sm text-gray-700">
                      {[
                        "Prioridade Baixa",
                        "Prioridade Média",
                        "Prioridade Alta",
                      ].map((prioridade) => (
                        <label
                          key={prioridade}
                          className="flex items-center gap-2"
                        >
                          <input
                            className="cursor-pointer"
                            type="checkbox"
                            checked={filtroPrioridade.includes(prioridade)}
                            onChange={() => togglePrioridade(prioridade)}
                          />
                          {prioridade.replace("Prioridade", "Prioridade")}
                        </label>
                      ))}
                      <span
                        onClick={() => setFiltroPrioridade([])}
                        className="text-center cursor-pointer text-sm text-blue-600 hover:underline"
                      >
                        Limpar Filtros
                      </span>
                    </form>
                  </div>
                )}
              </div>
            </div>
            {/*Header Filtros */}
            <div className="flex  flex-row justify-between text-gray-400 my-10  font-bold border-b  border-b-[#D1D5DB]">
              <span
                onClick={() => setFiltroAtivo("todos")}
                className={`py-2 cursor-pointer ${filtroAtivo === "todos"
                  ? "text-background border-b border-b-background"
                  : ""
                  }`}
              >
                Todos os tickets ({tickets.length})
              </span>
              <span
                onClick={() => setFiltroAtivo("hoje")}
                className={`py-2 cursor-pointer ${filtroAtivo === "hoje"
                  ? "text-background border-b border-b-background"
                  : ""
                  }`}
              >
                Hoje (
                {
                  tickets.filter(
                    (ticket) =>
                      formatarData(ticket.data_criacao) ===
                      formatarData(Date.now())
                  ).length
                }
                )
              </span>
              <span
                onClick={() => setFiltroAtivo("meus")}
                className={`py-2 cursor-pointer ${filtroAtivo === "meus"
                  ? "text-background border-b border-b-background"
                  : ""
                  }`}
              >
                Atribuidos a mim (
                {
                  tickets.filter((ticket) => parseInt(ticket.atribuido_a) === 1)
                    .length
                }
                )
              </span>
              <span
                onClick={() => setFiltroAtivo("outros")}
                className={`py-2 cursor-pointer ${filtroAtivo === "outros"
                  ? "text-background border-b border-b-background"
                  : ""
                  }`}
              >
                Atribuidos a outros (
                {
                  tickets.filter(
                    (ticket) =>
                      parseInt(ticket.atribuido_a) &&
                      parseInt(ticket.atribuido_a) !== 1
                  ).length
                }
                )
              </span>
              <span
                onClick={() => setFiltroAtivo("nao_atribuidos")}
                className={`py-2 cursor-pointer ${filtroAtivo === "nao_atribuidos"
                  ? "text-background border-b border-b-background"
                  : ""
                  }`}
              >
                Não atribuidos (
                {tickets.filter((ticket) => !ticket.atribuido_a).length})
              </span>
              <div className={`flex items-center  py-2 cursor-pointer`}>
                <span className="text-sm">Ordenar:</span>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="text-sm text-[#B3B7BC] outline-none rounded"
                >
                  <option value="">Escolha uma opção</option>
                  <option value="mais_novo">Do mais novo</option>
                  <option value="mais_antigo">Do mais antigo</option>
                </select>
              </div>
            </div>

            {/*Tabela */}
            <div>
              <table
                className="w-[100%] border border-collapse bg-white rounded overflow-hidden shadow-md
               table-fixed"
              >
                <thead className="bg-theadColor text-[13px] text-white font-bold">
                  <tr>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Código do Ticket
                    </th>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Assunto
                    </th>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Técnico
                    </th>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Solicitante
                    </th>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Status
                    </th>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Criação
                    </th>
                    <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">
                      Mensagens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsPaginados.map((ticket, index) => (
                    <tr
                      key={ticket.id_ticket}
                      className={`text-center text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"
                        } cursor-pointer`}
                      onClick={() => handleTicketSelected(ticket.id_ticket)}
                    >
                      <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden  text-ellipsis">
                        {ticket.codigo_ticket}
                      </td>
                      <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {ticket.assunto}
                      </td>
                      <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {ticket.nome_usuarioAtribuido || "Não atribuido"}
                      </td>
                      <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {ticket.nome_requisitante}
                      </td>

                      <td className="py-3  px-1 border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {ticket.status}
                      </td>
                      <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {formatarData(ticket.data_criacao)}
                      </td>
                      <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                        <div className="flex items-center justify-center gap-2 ">
                          <span> {ticket.respostas.length}</span>

                          {ticket.respostas.some(
                            (resposta: { lida: boolean }) =>
                              resposta.lida === false
                          ) && (
                              <div className="flex items-center">
                                <Bell size={15} color="#BD2626" />
                                <span className="relative bottom-1 text-[#BD2626] font-bold">
                                  {
                                    ticket.respostas.filter(
                                      (resposta: { lida: boolean }) =>
                                        !resposta.lida
                                    ).length
                                  }
                                </span>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading ? (
                <div className="flex items-center justify-center py-6 w-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#7E0000] border-t-transparent"></div>
                </div>
              ) : ticketsPaginados.length <= 0 ? (
                <div className="flex items-center justify-center bg-[#f8f8f8] py-3 w-full shadow-md">
                  Não existe tickets
                </div>
              ) : null}
            </div>

            {/*Paginação */}
            <div className="flex flex-row justify-between mt-5 text-sm text-[#4B4B4B]">
              <div className="flex items-center gap-2 py-5 ">
                <span>Exibir</span>
                <select
                  onChange={(event) => selectQtde(Number(event.target.value))}
                  className="p-1 border border-[#B3B7BC] outline-none rounded"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span>itens por página</span>
              </div>
              <div className="flex flex-row items-center gap-5">
                <SquareArrowLeft
                  className={`cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  size={25}
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage((prev) => prev - 1);
                    }
                  }}
                />

                <span>
                  Página {currentPage} de{" "}
                  {Math.max(1, Math.ceil(filteredTickets.length / itemPage))}
                </span>

                <SquareArrowRight
                  className={`cursor-pointer ${currentPage >= Math.ceil(filteredTickets.length / itemPage)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                  size={25}
                  onClick={() => {
                    const totalPages = Math.ceil(
                      filteredTickets.length / itemPage
                    );
                    if (currentPage < totalPages) {
                      setCurrentPage((prev) => prev + 1);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PaginaPadrao>
  );
};

export default TicketsClose;
