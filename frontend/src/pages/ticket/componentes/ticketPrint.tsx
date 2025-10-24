// TicketPrint.tsx
import { forwardRef } from "react";
import logo from "../../../assets/logo.png"; // importe direto do seu projeto

interface TicketPrintProps {
  ticket: any;
  historicoStatus: any[];
  formatarDataHora: (data: string) => string;
}

export const TicketPrint = forwardRef<HTMLDivElement | null, TicketPrintProps>(
  ({ ticket, historicoStatus, formatarDataHora }, ref) => {


    return (
      <div ref={ref} className="p-10 font-sans bg-gray-50">
        {/* Header */}
        <header className="flex justify-between items-center border-b-4 border-red-700 pb-3 mb-8">
          <h1 className="text-2xl font-bold text-red-700">
            Ticket {ticket?.ticket.codigo_ticket}
          </h1>
          <img src={logo} alt="Logo" className="w-56 rounded-md" />
        </header>

        {/* Dados do Requisitante e Assunto */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="bg-white rounded-lg p-5 shadow flex-1">
            <h2 className="text-lg font-semibold border-l-4 border-red-700 pl-2 mb-3">
              Dados do Requisitante
            </h2>
            <p><strong>Nome:</strong> {ticket?.ticket.nome_requisitante}</p>
            <p><strong>E-mail:</strong> {ticket?.ticket.email}</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow flex-1">
            <h2 className="text-lg font-semibold border-l-4 border-red-700 pl-2 mb-3">
              Assunto
            </h2>
            <p>{ticket?.ticket.assunto}</p>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white rounded-lg p-5 shadow mb-6">
          <h2 className="text-lg font-semibold border-l-4 border-red-700 pl-2 mb-3">
            Descrição
          </h2>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ticket?.ticket?.descricao || "" }}
          />
        </div>

        {/* Última Mensagem */}
        <div className="bg-white rounded-lg p-5 shadow mb-6 mt-52">
          <h2 className="text-lg font-semibold border-l-4 border-red-700 pl-2 mb-3">
            Última Mensagem
          </h2>
          {ticket?.respostas.length > 0 ? (
            <>
              <p>
                <strong>Enviado por:</strong>{" "}
                {ticket.respostas.at(-1)?.id_usuario
                  ? ticket.respostas.at(-1)?.nome_usuario
                  : ticket.respostas.at(-1)?.nome_requisitante}
              </p>
              <p><strong>Data/Hora:</strong> {ticket.respostas.at(-1)?.data_hora}</p>

              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ticket.respostas.at(-1)?.conteudo || "" }}
              />
            </>
          ) : (
            <p>Não há mensagens.</p>
          )}
        </div>

        {/* Histórico de Status */}
        <div className="bg-white rounded-lg p-5 shadow mb-6">
          <h2 className="text-lg font-semibold border-l-4 border-red-700 pl-2 mb-3">
            Histórico de Status
          </h2>
          {historicoStatus?.map((item, idx) => (
            <div key={idx} className="mb-4">
              <p><strong>Data/Hora:</strong> {formatarDataHora(item.data_hora)}</p>
              <p><strong>Status:</strong> {item.nome_status}</p>
              <div className="border-b border-gray-300 my-3" />
            </div>
          ))}
        </div>
      </div>

    );
  }
);
