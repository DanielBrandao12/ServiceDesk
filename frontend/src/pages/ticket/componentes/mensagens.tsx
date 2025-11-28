import { Download, X } from "lucide-react";
import type { RespostaView } from "../../../services/types";
import { formatarDataHora } from "../../../utils/dateHour";
import { pegarIniciais } from "../../../utils/letraInicial";
import { useEffect, useRef, useState } from "react";
import { chamadasRespostas } from "../../../services/endpoints/respostas";
import { chamadasAnexo } from "../../../services/endpoints/anexo";
import { downloadAnexo } from "../../../utils/downloadAnexo";

import { getUserData } from "../../../utils/getUser";


interface mensagensProps {
  onClose: () => void;
  mensagens: RespostaView[];
  codigoTicket: string;
  id_ticket: number;
  remetente: string;
  carregarMensagens: () => void;

}



export const Mensagens = ({ onClose, mensagens, codigoTicket, id_ticket, remetente, carregarMensagens }: mensagensProps) => {

  const [mensagemComAnexo, setMensagemComAnexo] = useState<RespostaView[]>([]);
  const [conteudo, setConteudo] = useState<string>('');
  const [temNaoLidasAcima, setTemNaoLidasAcima] = useState(false);
  const [error, setError] = useState<string>('');
  const [arquivos, setArquivos] = useState<File[]>([]);
  const user: any = getUserData();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Ao carregar mensagens, rola para a primeira não lida
  useEffect(() => {
    if (!mensagemComAnexo.length) return;

    const primeiraNaoLidaIndex = mensagemComAnexo.findIndex((m) => !m.lida);

    if (primeiraNaoLidaIndex !== -1) {
      const elemento = document.querySelectorAll("[data-id]")[primeiraNaoLidaIndex];
      elemento?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Se todas já estão lidas, rola para o final
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [mensagemComAnexo]);

  useEffect(() => {
    // Carrega anexos ao montar o componente
    const carregarAnexos = async () => {
      try {
        await adicionarAnexo();

      } catch (erro) {
        console.error("Erro ao carregar anexos:", erro);
      }
    };

    carregarAnexos();
  }, [mensagens, carregarMensagens]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"));
            const mensagem = mensagemComAnexo.find((m) => m.id_resposta === id);

            if (mensagem && !mensagem.lida) {
              // chama backend para marcar como lida
              await chamadasRespostas.editarResposta(mensagem.id_resposta);

              // atualiza estado local
              setMensagemComAnexo((prev) =>
                prev.map((m) =>
                  m.id_resposta === id ? { ...m, lida: true } : m
                )
              );
            }
          }
        }
      },
      { threshold: 0.1 } // dispara quando 10% da mensagem aparece
    );

    const elementos = document.querySelectorAll("[data-id]");
    elementos.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mensagemComAnexo]);

  const criarResposta = async () => {

    try {
      //Validação básica antes de enviar
      if (!id_ticket || !conteudo?.trim()) {
        setError("Campos obrigatórios não preenchidos.");
        return;
      }

      const anexoData = new FormData();
      // campos da resposta
      anexoData.append("id_ticket", id_ticket.toString());
      anexoData.append("id_usuario", user?.id);//vou pegar o id do user logado
      anexoData.append("conteudo", conteudo.trim());
      anexoData.append("codigoTicket", codigoTicket);
      anexoData.append("remetente", remetente);

      // arquivos
      arquivos.forEach(file => {
        anexoData.append("arquivos", file);
      });

      const res = await chamadasRespostas.criarResposta(anexoData);
      uploadAnexo(res.respostaCriada.id_resposta)
      //Limpa campos e atualiza interface (se aplicável)
      setConteudo?.(""); // só se existir o setConteudo
      // load?.((prev: boolean) => !prev); // força recarregar ticket, se você estiver usando isso
      carregarMensagens();
    }
    catch (erro) {
      console.error("Erro ao criar resposta:", erro);
    }

  }

  const adicionarAnexo = async () => {
    try {
      const mensagensAnexo = await Promise.all(
        mensagens.map(async (item) => {
          const res = await chamadasAnexo.listarAnexos(item.id_resposta);
          const anexos = Array.isArray(res) ? res : [];

          return {
            ...item,
            anexos,
          };
        })
      );
      console.log(mensagensAnexo)
      setMensagemComAnexo(mensagensAnexo)

    } catch (error) {
      console.error("Erro ao adicionar anexos:", error);
      return [];
    }
  };

  const uploadAnexo = async (idResposta: number) => {
    if (arquivos.length === 0) return;

    const formData = new FormData();
    arquivos.forEach((file) => {
      formData.append("anexos", file);
    });
    formData.append("idResposta", idResposta.toString());
    formData.append("idTicket", id_ticket.toString());

    try {
      await chamadasAnexo.createAnexo(formData);
      setArquivos([]);
    } catch (err) {
      console.error("Erro ao enviar anexos:", err);
    }
  };


  // Função para remover um arquivo da lista
  const removerArquivo = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

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
        {temNaoLidasAcima && (
          <div
            className="text-center bg-yellow-100 text-yellow-800 text-sm py-2 cursor-pointer hover:bg-yellow-200 transition"
            onClick={() => {
              scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              setTemNaoLidasAcima(false);
            }}
          >
            Há mensagens não lidas acima — clique para visualizar
          </div>
        )}
        {/* Lista de mensagens */}
        {
          mensagemComAnexo.length > 0 ? (
            <div
              ref={scrollRef} className="flex flex-col flex-1 overflow-y-auto p-8 space-y-6 h-52">
              {mensagemComAnexo.map((mensagem, i) => (
                <div
                  key={i}
                  data-id={mensagem.id_resposta}
                  className="flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex items-center justify-center
                          w-7 h-7 rounded-full
                         ${mensagem.nome_usuario ? 'bg-primary text-white' : 'bg-white text-primary border border-primary'}   font-semibold
                          shadow-sm select-none
                        `}
                        title={mensagem.id_usuario ? mensagem.nome_usuario : mensagem.nome_requisitante}
                      >
                        <span className="text-xs">
                          {pegarIniciais(
                            mensagem.id_usuario ? mensagem.nome_usuario : mensagem.nome_requisitante
                          )}
                        </span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {mensagem.id_usuario ? mensagem.nome_usuario + " - Técnico" : mensagem.nome_requisitante + " - Solicitante"}
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
                    <div className="flex items-center gap-6  mt-6">

                      {mensagem.anexos.length > 0 ? (mensagem.anexos.map((item: any, i: any) => (
                        <div
                          key={i}
                          onClick={() => (downloadAnexo(item.id, item.nome))}
                          className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-[#BD2626]"
                        >
                          <span
                            className="
                              text-xs
                              text-primary 
                              border-b-2 
                              border-transparent 
                              hover:border-b-primary 
                              cursor-pointer 
                              transition-colors
                            "
                          >
                            {item.nome} {i + 1}
                          </span>
                          <Download size={14} className="text-primary" />
                        </div>
                      ))) : (<span></span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-y-auto p-8 space-y-6 h-52">
              <span>Não existe mensagens</span>
            </div>
          )
        }


        {/* Área de envio */}
        <div className="border-t bg-gray-50 p-4 flex flex-col gap-3">
          <textarea
            className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary focus:outline-none text-sm"
            placeholder="Digite sua mensagem..."
            rows={3}
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            onFocus={() => setError('')}
          ></textarea>
          {error && <span className="text-xs text-red-700">{error}</span>}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <label
                htmlFor="inputAnexo"
                className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Anexar arquivos
              </label>

              <input
                id="inputAnexo"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  if (files.length > 0) {
                    setArquivos((prev) => [...prev, ...files]); // adiciona sem substituir
                    console.log("Arquivos selecionados:", files);
                  }
                }}
              />
              {arquivos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {arquivos.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 bg-gray-100 border px-2 py-1 rounded text-xs"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => removerArquivo(i)}
                        className="text-red-600 hover:text-red-800"
                        title="Remover arquivo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <button onClick={criarResposta} className="text-sm px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
