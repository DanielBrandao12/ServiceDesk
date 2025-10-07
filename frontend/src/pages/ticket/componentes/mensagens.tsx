import { X } from "lucide-react";
import type { Resposta, RespostaView } from "../../../services/types";
import { formatarDataHora } from "../../../utils/dateHour";
import { pegarIniciais } from "../../../utils/letraInicial";
import { useEffect, useRef, useState } from "react";
import { chamadasRespostas } from "../../../services/endpoints/respostas";


interface mensagensProps {
  onClose: () => void;
  mensagens: RespostaView[];
  codigoTicket: string;
  id_ticket: number;
  remetente: string;
}



export const Mensagens = ({ onClose, mensagens, codigoTicket, id_ticket, remetente }: mensagensProps) => {



  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Joga o scroll para o final
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]); // toda vez que mensagens mudar, desce pro final

  const [conteudo, setConteudo] = useState<string>('')
  console.log(remetente)
  const criarResposta = async () =>{

    const dados: any = {
      id_ticket,
      id_usuario: 1,
      conteudo,
      codigoTicket,
      remetente
    }

  const respostaCriada = await chamadasRespostas.criarResposta(dados)

  console.log(respostaCriada)


  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 mb-5 max-w-[1400px]">

      {/* Cabeçalho */}
      <div className="w-[45vw] h-[95vh] flex flex-col">
        <header className="flex flex-row justify-between p-6 gap-2 font-bold text-[#4B4B4B] border-b">
          <div>

            <h1 className="text-xl">Mensagens</h1>
            <span className="text-sm font-normal text-gray-500">
              Ticket #{codigoTicket}
            </span>
          </div>

          <button onClick={onClose} className="p-4"><X /></button>
        </header>

        {/* Lista de mensagens */}
        <div
          ref={scrollRef} className="flex flex-col flex-1 overflow-y-auto p-8 space-y-6">
          {mensagens.map((mensagem, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center text-white font-semibold w-9 h-9 rounded-full bg-primary">
                    <span>{pegarIniciais(mensagem.nome_requisitante)}</span>
                  </div>
                  <span className="font-medium text-gray-700">
                    {mensagem.nome_requisitante} - Solicitante
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatarDataHora(mensagem.data_hora)}
                </span>
              </div>

              <div className="flex flex-col items-start text-start p-4 bg-gray-50 border-l-2 border-primary rounded-md text-sm text-gray-700 shadow-sm ml-12">
                <p
                  className="leading-relaxed "
                  dangerouslySetInnerHTML={{
                    __html: mensagem.conteudo || "",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Área de envio */}
        <div className="border-t bg-gray-50 p-4 flex flex-col gap-3">
          <textarea
            className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary focus:outline-none text-sm"
            placeholder="Digite sua mensagem..."
            rows={3}
            value={conteudo}
            onChange={(e)=> setConteudo(e.target.value)}
          ></textarea>

          <div className="flex justify-between items-center">
            <button className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              Anexo
            </button>
            <button onClick={criarResposta} className="text-sm px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
