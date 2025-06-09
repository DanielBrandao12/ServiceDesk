import { useEffect, useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import { ChamadasTickets } from "../../services/endpoints/tickets";
import type { TicketView } from "../../services/types"; // ou ajuste o caminho correto
 // ou ajuste o caminho correto

const Home = () => {
  const [tickets, setTickets] = useState<TicketView[]>([]);

  useEffect(() => {
    ChamadasTickets.listarTickets()
      .then((res) => {
        console.log(res);
        setTickets(res);
      })
      .catch((err) => {
        console.error("Erro ao buscar tickets:", err);
      });
  }, []); // ← só executa uma vez ao montar o componente

  return (
    <PaginaPadrao>
      <h2>Lista de Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id_ticket}>
            {ticket.assunto}
          </li>
        ))}
      </ul>
    </PaginaPadrao>
  );
};

export default Home;
