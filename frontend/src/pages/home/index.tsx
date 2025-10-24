import { useEffect, useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import { ChamadasTickets } from "../../services/endpoints/tickets";
import type { TicketView } from "../../services/types";
import {
  Ticket,
  CheckCircle,
  Users,
  Clock,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  Hourglass,
} from "lucide-react";

const Home = () => {
  const [tickets, setTickets] = useState<TicketView[]>([]);
  const [periodo, setPeriodo] = useState("Hoje");

  useEffect(() => {
    ChamadasTickets.listarTickets()
      .then((res) => setTickets(res))
      .catch((err) => console.error("Erro ao buscar tickets:", err));
  }, []);

  const metricas = [
    { titulo: "Tickets abertos", valor: 24, icone: <Ticket className="text-primary" /> },
    { titulo: "Tickets fechados", valor: 10, icone: <CheckCircle className="text-primary" /> },
    { titulo: "Tickets atribuídos", valor: 12, icone: <Users className="text-primary" /> },
    { titulo: "Tickets não atribuídos", valor: 2, icone: <AlertTriangle className="text-primary" /> },
    { titulo: "Aguardando Classificação", valor: 5, icone: <HelpCircle className="text-primary" /> },
    { titulo: "Em atendimento", valor: 10, icone: <Clock className="text-primary" /> },
    { titulo: "Aguardando atendimento", valor: 12, icone: <Hourglass className="text-primary" /> },
    { titulo: "Pendente Resposta", valor: 2, icone: <MessageCircle className="text-primary" /> },
  ];

  const categorias = [
    { titulo: "HardWare", valor: 32 },
    { titulo: "Software", valor: 12 },
    { titulo: "Alteração de senha do email", valor: 12 },
    { titulo: "Conta bloqueada", valor: 14 },
    { titulo: "HardWare", valor: 32 },
    { titulo: "Software", valor: 12 },
    { titulo: "Alteração de senha do email", valor: 12 },
    { titulo: "Conta bloqueada", valor: 14 },
  ];

  return (
    <PaginaPadrao>
      <div className="flex flex-col m-10 gap-6 p-4 w-full">
        {/* ====== CABEÇALHO ====== */}
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Visão Geral de Hoje</h1>

          <div className="flex flex-row items-center gap-2 text-right">
            <label className="text-sm font-semibold text-gray-600">Período</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 outline-none cursor-pointer hover:border-gray-400 transition"
            >
              <option value="Hoje">Hoje</option>
              <option value="Esta semana">Esta semana</option>
              <option value="Este mês">Este mês</option>
              <option value="Este ano">Este ano</option>
              <option value="Todo período">Todo período</option>
            </select>
          </div>
        </div>

        {/* ====== MÉTRICAS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metricas.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="mb-2">{item.icone}</div>
              <h3 className="text-sm font-medium text-gray-700 text-center mb-1">{item.titulo}</h3>
              <span className="text-4xl font-semibold text-gray-900">{item.valor}</span>
            </div>
          ))}
        </div>

        {/* ====== CATEGORIAS ====== */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 px-2">
            Categorias com Mais Chamados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <h3 className="text-sm font-medium text-gray-700 text-center mb-1">
                  {item.titulo}
                </h3>
                <span className="text-4xl font-semibold text-gray-900">{item.valor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PaginaPadrao>
  );
};

export default Home;
