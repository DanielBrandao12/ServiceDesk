import { useParams } from "react-router-dom";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card/card";
import { Calendar1, ChartPie, Download, History } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ChamadasTickets } from "../../services/endpoints/tickets";

import { chamadasAnexo } from "../../services/endpoints/anexo";

import { type TicketView, type HistoricoStatus, type Anexo } from "../../services/types";

import { chamadasHistorico } from "../../services/endpoints/historicoStatus";
import { InfoTicket } from "./componentes/infoTicket";
import { formatarDataHora } from "../../utils/dateHour";
import { TicketPrint } from "./componentes/ticketPrint";

const Ticket = () => {

  const componentRef = useRef<HTMLDivElement>(null);
  const [abaAtiva, setAbaAtiva] = useState("mensagens");
  const { idTicket } = useParams<{ idTicket: string }>();
  const idTicketNumber = idTicket ? parseInt(idTicket, 10) : null;
  const [ticket, setTicket] = useState<TicketView>();
  const [loadTicket, setLoadTicket] = useState<boolean>(false)
  const [historicoStatus, setHistoricoStatus] = useState<HistoricoStatus[]>([]);
  const [anexos, setAnexos] = useState<Anexo[]>([])

  useEffect(() => {
    if (!idTicketNumber) return;

    ChamadasTickets.listarTicket(idTicketNumber)
      .then((res) => {
        console.log("Ticket encontrado:", res);
        setTicket(res);
        console.log(ticket);
      })
      .catch((err) => {
        console.error("Erro ao buscar tickets:", err);
      });

    chamadasHistorico.getHistorico(idTicketNumber).then((res) => {
      setHistoricoStatus(res);
      console.log(res);
    });

  }, [idTicketNumber, loadTicket]);

  useEffect(() => {
    chamadasAnexo.listarAnexos(ticket?.ticket.codigo_ticket).then((res) => {

      if (Array.isArray(res)) {
        setAnexos(res); // só seta se for array
        console.log(res);
      } else {
        console.log(res);
        // opcional: setAnexos([]) pra limpar a lista
      }
    });
  }, [ticket]);

  const downloadAnexo = async (id: number) => {
    try {
      const response = await chamadasAnexo.listarAnexoId(id);
      const contentType = response.headers["content-type"] || "application/octet-stream";

      // tenta extrair o nome do arquivo do header
      let fileName = "arquivo";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar anexo:", error);
    }
  };



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
              <div className="flex flex-col gap-6 p-5">
                {/* Conteúdo do Ticket */}
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
                    {anexos.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => (downloadAnexo(item.id))}
                        className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-[#BD2626]"
                      >
                        <span>Anexo {i + 1}</span>
                        <Download size={14} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abas */}
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
                    <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>Enviado por:</span>

                          <span className="font-medium">
                            {ticket?.respostas.at(-1)?.id_usuario
                              ? ticket?.respostas.at(-1)?.nome_usuario
                              : ticket?.respostas.at(-1)?.nome_requisitante}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {ticket?.respostas.at(-1)?.data_hora}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: ticket?.respostas.at(-1)?.conteudo || "",
                        }}
                      />
                    </div>
                  ) : (
                    /*anotações  ainda não tem tabela no banco*/
                    <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>Criado por:</span>

                          <span className="font-medium">Daniel</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          02/05/2025 - 13:25
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Lorem ipsum dolor sit amet. Eos odio quos eum minus
                        ratione sit sint eius est error nostrum est dolor
                        aspernatur aut accusamus praesentium. Ut delectus
                        aliquam aut atque beatae sit harum animi! Quo ducimus
                        sequi est iusto fuga qui atque rerum et earum voluptate.
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end mt-4 p-4">
                    <button className="text-sm font-medium text-[#BD2626] hover:underline">
                      Ver todas
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="w-1/4 flex flex-col gap-6">
            <InfoTicket ticket={ticket} setLoadTicket={() => setLoadTicket(!loadTicket)} handlePrint={handlePrint} />

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
