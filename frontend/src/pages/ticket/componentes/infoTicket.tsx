import { useState, useEffect } from "react";

import {
  Calendar1,
  ChartPie,
  Edit2,
  Flag,
  Printer,
  Shapes,
  Tickets,
  Trash2,
  User,
  Save,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/card/card";
import { chamadasCategoria } from "../../../services/endpoints/categoria";
import { chamadasStatus } from "../../../services/endpoints/status";
import { chamadasUsers } from "../../../services/endpoints/users";
import type {
  Categoria,
  Status,
  Usuarios,
  TicketView,

} from "../../../services/types";
import { formatarDataHora } from "../../../utils/dateHour";
import { ChamadasTickets } from "../../../services/endpoints/tickets";
import Alert from "../../../components/alert";


interface TicketProps {
  ticket?: TicketView; // array de tickets
  setLoadTicket: () => void;
  handlePrint:  () => void;
}

export const InfoTicket: React.FC<TicketProps> = ({
  ticket,
  setLoadTicket,
  handlePrint
}) => {

  const [edit, setEdit] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);

  const [status, setStatus] = useState<Status[]>([]);
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [prioridade, setPrioridade] = useState<string>("");
  const [tecnico, setTecnico] = useState<Usuarios[]>([]);

  const [idStatus, setIdStatus] = useState<number>();
  const [idCategoria, setIdCategoria] = useState<number>();
  const [idTecnico, setIdTecnico] = useState<number>();
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [showConfirm, setShowConfirm] = useState(false);

 
  
  const listPrioridade: string[] = ["Prioridade Baixa", "Prioridade Média", "Prioridade Alta"]

  const navigate = useNavigate()

  useEffect(() => {
    chamadasCategoria.listarCategorias().then((res) => {
      setCategorias(res);
      const categoriaEncontrada = res.filter(
        (item) => ticket?.ticket.id_categoria === item.id_categoria
      );
      setCategoria(categoriaEncontrada);
      console.log(categoriaEncontrada);
    });

    chamadasStatus.listarStatus().then((res) => {
      setStatusList(res);
      const statusEncontrado = res.filter(
        (item) => ticket?.ticket.id_status === item.id_status
      );
      setStatus(statusEncontrado);
    });

    chamadasUsers.listarUsuarios().then((res) => {
      setUsuarios(res);

      const tecnicoEncontrado = res.filter(
        (item) => parseInt(ticket?.ticket.atribuido_a) === item.id_usuario
      );

      setTecnico(tecnicoEncontrado);
    });



  }, [ticket]);

const salvarEdicao = async () => {
  const dados: any = {
    id_ticket: ticket?.ticket.id_ticket,
    id_status: idStatus ?? ticket?.ticket.id_status, // usa o novo valor se existir, senão mantém o original
    atribuido_a: idTecnico ?? parseInt(ticket?.ticket.atribuido_a),
    nivel_prioridade: prioridade || ticket?.ticket.nivel_prioridade,
    id_categoria: idCategoria ?? ticket?.ticket.id_categoria,
  };

  const ticketAlterado = await ChamadasTickets.editarTicket(dados);
  setLoadTicket();
  setEdit(false);
  setShowAlert(true);
  setMessage(ticketAlterado.message);
};



  const excluirTicket = async () => {
    try {
      const ticketDeletado = await ChamadasTickets.deletarTicket(ticket?.ticket.id_ticket);
      setMessage(ticketDeletado.message);
      setShowAlert(true); // abre alert de sucesso

      // espera 2 segundos antes de navegar
      setTimeout(() => {
        navigate("/TicketsOpen");
      }, 5000);
    } catch (error) {
      setMessage("Erro ao excluir o ticket.");
      setShowAlert(true);
    }
  };

  // Função que abre o alert de confirmação
  const handleDeleteClick = () => {
    setShowConfirm(true);
  };


  return (
    <Card className="h-40">
      <div className="pb-2 border-b border-gray-300">
        <div className="flex  items-center gap-2 my-1 text-sm">
          <Tickets size={15} />
          <span className="font-semibold">Ticket: </span>

          <span className="font-medium">{ticket?.ticket.codigo_ticket}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar1 size={15} />
          <span className="font-semibold">Data e Hora: </span>

          <span className="font-medium">
            {formatarDataHora(ticket?.ticket.data_criacao)}
          </span>
        </div>
      </div>

      {!edit ? (
        <div className="flex flex-col gap-5 mt-5 pb-5 border-b border-gray-300">
          <div className="flex items-center gap-2 text-sm">
            <ChartPie size={15} />
            <span className="font-semibold">Status:</span>

            <span className="font-medium"> {status[0]?.nome}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shapes size={15} />
            <span className="font-semibold">Categoria:</span>

            <span className="font-medium">{categoria[0]?.nome}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flag size={15} />
            <span className="font-semibold">Prioridade:</span>

            <span className="font-medium">
              {ticket?.ticket.nivel_prioridade}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={15} />
            <span className="font-semibold">Técnico:</span>

            <span className="font-medium">{tecnico[0]?.nome_usuario}</span>
          </div>
          <div className="flex  justify-between px-2">
            <div className="flex items-center gap-1 mt-5">
              <Edit2 size={14} color="#BD2626" />
              <button
                onClick={() => setEdit(!edit)}
                className="text-sm font-bold text-[#BD2626] hover:underline"
              >
                Editar
              </button>
            </div>
            <div className="flex items-center gap-1 mt-5">
              <Trash2 size={14} color="#BD2626" />
              <button onClick={handleDeleteClick} className="text-sm font-bold text-[#BD2626] hover:underline">
                Excluir
              </button>
            </div>
            <div className="flex items-center gap-1 mt-5">
              <Printer size={14} color="#BD2626" />
              <button onClick={handlePrint} className="text-sm font-bold text-[#BD2626] hover:underline">
                Imprimir
              </button>
            </div>
          </div>
        </div> // MODO EDIÇÃO
      ) : (
        <div className="flex flex-col gap-5 mt-5 pb-5 border-b border-gray-300">
          <div className="flex items-center gap-2 text-sm">
            <ChartPie size={15} />
            <span className="font-semibold">Status:</span>
            <select
              className="w-40 border rounded px-2 py-1 text-xs truncate"
              value={status[0]?.id_status}
              onChange={(e) => setIdStatus(Number(e.target.value))}
            >
              {statusList &&
                statusList.map((item) => (
                  <option
                    key={item.id_status}
                    className={
                      item.id_status === ticket?.ticket.id_status
                        ? "text-green-600"
                        : ""
                    }
                    value={item.id_status}
                    title={item.nome}
                  >
                    {item.nome}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Shapes size={15} />
            <span className="font-semibold">Categoria:</span>
            <select
              className="w-40 border rounded px-2 py-1 text-xs truncate"
              value={categoria[0]?.id_categoria}
              onChange={(e) => setIdCategoria(Number(e.target.value))}
            >
              {categorias &&
                categorias.map((item) => (
                  <option
                    key={item.id_categoria}
                    value={item.id_categoria}
                    className={
                      item.id_categoria === ticket?.ticket.id_categoria
                        ? "text-green-600"
                        : ""
                    }
                    title={item.nome}
                  >
                    {item.nome}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Flag size={15} />
            <span className="font-semibold">Prioridade:</span>
            <select
              className="border rounded px-2 py-1 text-xs"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              {
                listPrioridade.map((item, index)=>(
                    <option  key={index} value={item}  className={
                      item === ticket?.ticket.prioridade
                        ? "text-green-600"
                        : ""
                    }
                    title={prioridade}
                    >{item}</option>
                ))
              }
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User size={15} />
            <span className="font-semibold">Técnico:</span>
            <select
              className="w-40 border rounded px-2 py-1 text-xs truncate"
              value={tecnico[0]?.id_usuario}
              onChange={(e) => setIdTecnico(Number(e.target.value))}
            >
              {usuarios &&
                usuarios.map((item) => (
                  <option
                    key={item.id_usuario}
                    value={item.id_usuario}
                    className={
                      item.id_usuario === parseInt(ticket?.ticket.atribuido_a)
                        ? "text-green-600"
                        : ""
                    }
                    title={item.nome_usuario}
                  >
                    {item.nome_usuario}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-between px-2">
            <div className="flex items-center gap-1 mt-5">
              <Save size={14} color="#BD2626" />
              <button
                className="text-sm font-bold text-[#BD2626] hover:underline"
                onClick={salvarEdicao}
              >
                Salvar
              </button>
            </div>
            <div className="flex items-center gap-1 mt-5">
              <Ban size={14} color="#BD2626" />
              <button
                onClick={() => setEdit(false)}
                className="text-sm font-bold text-[#BD2626] hover:underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {
        showAlert && (
          <Alert message={message} onClose={() => setShowAlert(!showAlert)} />
        )
      }

      {
        showConfirm && (
          <Alert
            title="Confirmação"
            message="Tem certeza que deseja excluir este ticket?"
            onClose={() => setShowConfirm(false)} // cancelar
            onConfirm={() => {
              setShowConfirm(false);
              excluirTicket(); // só exclui se confirmar
            }}
          />
        )
      }

    </Card>
  );
};
