import { useParams } from "react-router-dom";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card/card";
import { Calendar1, ChartPie, Download, History } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ChamadasTickets } from "../../services/endpoints/tickets";

import { chamadasAnexo } from "../../services/endpoints/anexo";

import { type TicketView, type HistoricoStatus, type Anexo, type Anotacao } from "../../services/types";

import { chamadasHistorico } from "../../services/endpoints/historicoStatus";
import { InfoTicket } from "./componentes/infoTicket";
import { formatarDataHora } from "../../utils/dateHour";
import { TicketPrint } from "./componentes/ticketPrint";
import { Mensagens } from "./componentes/mensagens";
import { downloadAnexo } from "../../utils/downloadAnexo";
import { chamadasAnotacoes } from "../../services/endpoints/anotacao";
import { Anotacoes } from "./componentes/anotações";

const Ticket = () => {

  const componentRef = useRef<HTMLDivElement>(null);
  const [abaAtiva, setAbaAtiva] = useState("mensagens");
  const { idTicket } = useParams<{ idTicket: string }>();
  const idTicketNumber = idTicket ? parseInt(idTicket, 10) : null;
  const [ticket, setTicket] = useState<TicketView>();
  const [loadTicket, setLoadTicket] = useState<boolean>(false);
  const [historicoStatus, setHistoricoStatus] = useState<HistoricoStatus[]>([]);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showAnotacao, setShowAntoacao] = useState<boolean>(false);
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);

  const carregarTicket = async () => {
    try {
      if (!idTicketNumber) return;
      const res = await ChamadasTickets.listarTicket(idTicketNumber);
      setTicket(res);
    } catch (err) {
      console.error("Erro ao buscar ticket:", err);
    }
  };

  const carregarHistorico = async () => {
    try {
      if (!idTicketNumber) return;
      const res = await chamadasHistorico.getHistorico(idTicketNumber);
      setHistoricoStatus(res);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    }
  };

  const carregarAnotacoes = async () => {
    try {
      if (!idTicketNumber) return;
      const res = await chamadasAnotacoes.listarAnotacoes(idTicketNumber)

      setAnotacoes(res);
  
    } catch (err) {
      console.error("Erro ao anotações:", err);
    }
  }

  useEffect(() => {

    carregarTicket();
    carregarHistorico();
    carregarAnotacoes();
    // Atualiza automaticamente a cada 60 segundos
    const intervalo = setInterval(() => {
      carregarTicket();

    }, 60000);

    // Limpa o intervalo ao desmontar o componente ou mudar o ticket
    return () => clearInterval(intervalo);

  }, [idTicketNumber, loadTicket]);



  useEffect(() => {
    if (!ticket?.ticket?.codigo_ticket) return;

    const carregarAnexos = async () => {
      try {
        const res = await chamadasAnexo.listarAnexos(ticket.ticket.codigo_ticket);
        if (Array.isArray(res)) {
          setAnexos(res);
        } else {
          setAnexos([]);
          console.warn("Resposta inesperada ao listar anexos:", res);
        }
      } catch (err) {
        console.error("Erro ao carregar anexos:", err);
      }
    };

    carregarAnexos();
  }, [ticket]);


  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Ticket-${ticket?.ticket.codigo_ticket}`,
  });


  return (
    <PaginaPadrao>
      <div className="w-[100%] flex flex-col  gap-5 p-20 overflow-scroll">
        {/*Titulo */}
        <h1 className="text-gray-800 font-bold text-lg">
          Ticket:{" "}
          <span className="text-[#4B4B4B]">
            {ticket && ticket.ticket.codigo_ticket}
          </span>
        </h1>

        <div className="flex flex-row gap-6">
          {/* Coluna Esquerda */}
          <div className="w-3/4 flex flex-col gap-6">
            <Card>

              {/* Dados do Usuário */}
              <div className="flex flex-col gap-2  p-1 text-xs text-[#4B4B4B] font-bold">
                <span>
                  <span className="text-black">Enviado por:</span>{" "}
                  <span className="font-normal">
                    {ticket && ticket.ticket.nome_requisitante}
                  </span>
                </span>
                <span>
                  <span className="text-black">E-mail:</span>{" "}
                  <span className="font-normal">
                    {ticket && ticket.ticket.email}
                  </span>
                </span>
              </div>

                {/* Conteúdo do Ticket */}
              <div className="flex flex-col gap-6 p-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-black">
                    {ticket && ticket.ticket.assunto}
                  </h2>
                  <p
                    className="text-sm leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: ticket?.ticket?.descricao || "",
                    }}
                  />
                </div>

                {/* Anexos */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Anexos</h3>

                  <div className="flex items-center gap-6 text-sm">

                    {anexos.length > 0 ? (anexos.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => (downloadAnexo(item.id, item.nome))}
                        className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-[#BD2626]"
                      >
                        <span>{item.nome} {i + 1}</span>
                        <Download size={14} />
                      </div>
                    ))) : (<span>Sem anexos</span>)}
                  </div>
                </div>

                {/* Abas mensgens e anotações */}
                <div>
                  <div className="flex gap-10 border-b border-gray-300">
                    <button
                      onClick={() => setAbaAtiva("mensagens")}
                      className={`pb-2 text-sm font-medium ${abaAtiva === "mensagens"
                        ? "border-b-2 border-[#BD2626] text-[#BD2626]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Mensagens
                    </button>
                    <button
                      onClick={() => setAbaAtiva("anotacoes")}
                      className={`pb-2 text-sm font-medium ${abaAtiva === "anotacoes"
                        ? "border-b-2 border-[#BD2626] text-[#BD2626]"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Anotações internas
                    </button>
                  </div>

                  {/* Conteúdo da Aba */}
                  {abaAtiva === "mensagens" ? (

                    /*Mensagens */
                    <div>
                      {
                        ticket?.respostas.length > 0 ? (
                          <div>
                            <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span>Enviado por:</span>

                                  <span className="font-medium text-gray-500">
                                    {ticket?.respostas.at(-1)?.id_usuario
                                      ? ticket?.respostas.at(-1)?.nome_usuario + " - Técnico "
                                      : ticket?.respostas.at(-1)?.nome_requisitante + " - Solicitante "}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatarDataHora(ticket?.respostas.at(-1)?.data_hora)}
                                </span>
                              </div>
                              <p
                                className="text-sm leading-relaxed text-gray-700"
                                dangerouslySetInnerHTML={{
                                  __html: ticket?.respostas.at(-1)?.conteudo || "",
                                }}
                              />
                            </div>
                            <div className="flex justify-end mt-4 p-4">
                              <button onClick={() => setShowMessage(true)} className="text-sm font-medium text-[#BD2626] hover:underline">
                                Ver todas
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6">

                            <span>Não existe mensagens</span>
                            <div className="flex justify-end mt-4 p-4">
                              <button onClick={() => setShowMessage(true)} className="text-sm font-medium text-[#BD2626] hover:underline">
                                Enviar mensagem
                              </button>
                            </div>
                          </div>
                        )
                      }

                    </div>
                  ) : (

                    /*Anotações */
                    <div>
                      {
                        anotacoes.length > 0 ? (

                          <div>
                            <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span>Criado por:</span>

                                  <span className="font-medium">{anotacoes.at(-1)?.nome_usuario || ""}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatarDataHora(anotacoes.at(-1)?.data_hora) || ""}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700" >
                                {anotacoes.at(-1)?.descricao || ""}
                              </p>
                            </div>
                            <div className="flex justify-end mt-4 p-4">
                              <button onClick={() => setShowAntoacao(true)} className="text-sm font-medium text-[#BD2626] hover:underline">
                                Ver todas
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6">

                            <span>Não existe anotações</span>
                            <div className="flex justify-end mt-4 p-4">
                              <button onClick={() => setShowAntoacao(true)} className="text-sm font-medium text-[#BD2626] hover:underline">
                                Criar Anotação
                              </button>
                            </div>
                          </div>)
                      }


                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="w-1/4 flex flex-col gap-6">

            {/*Card de informações do ticket */}
            <InfoTicket ticket={ticket} setLoadTicket={() => setLoadTicket(!loadTicket)} handlePrint={handlePrint} />
            
            {/*Card do histórico da alteração de status do ticket */}
            <Card className="h-40 ">
              <div className="flex items-center  justify-between py-4 text-xl font-bold ">
                <span>Histórico Status</span>
                <History size={25} />
              </div>

              <hr className="border-gray-500" />
              <div className="flex flex-col gap-5 mt-5">
                {historicoStatus &&
                  historicoStatus.map((item) => (
                    <div
                      key={item.id_historico}
                      className="flex flex-col gap-2 border-b border-gray-300 py-2"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar1 size={15} />
                        <span className="font-semibold">Data e Hora: </span>

                        <span className="font-medium">
                          {formatarDataHora(item.data_hora)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ChartPie size={15} />
                        <span className="font-semibold">Status:</span>

                        <span className="font-medium">{item.nome_status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

        </div>

        
        {/*Modal mensagens */}
        {
          showMessage && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center text-center gap-4">
                <Mensagens onClose={() => setShowMessage(false)} carregarMensagens={() => carregarTicket()}
                  mensagens={ticket?.respostas}
                  codigoTicket={ticket?.ticket.codigo_ticket}
                  id_ticket={ticket?.ticket.id_ticket}
                  remetente={ticket?.ticket.email}
                />
              </div>
            </div>
          )
        }


         {/*Modal anotações */}
        {
          showAnotacao && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center text-center gap-4">
                <Anotacoes idTicket={ticket?.ticket.id_ticket} anotacoes={anotacoes} onShow={() => setShowAntoacao(false)} carregarAnotacoes={() => carregarAnotacoes()} />
              </div>
            </div>
          )
        }

      </div>

      {/* componente invisível só para impressão */}
      <div style={{ display: "none" }}>
        <TicketPrint
          ref={componentRef}
          ticket={ticket}
          historicoStatus={historicoStatus}
          formatarDataHora={formatarDataHora}
        />
      </div>


    </PaginaPadrao>
  );
};

export default Ticket;
