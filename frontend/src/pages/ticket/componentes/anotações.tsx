import { X } from "lucide-react"
import type { Anotacao } from "../../../services/types";
import { pegarIniciais } from "../../../utils/letraInicial";
import { formatarDataHora } from "../../../utils/dateHour";
import { chamadasAnotacoes } from "../../../services/endpoints/anotacao";
import { useState } from "react";



interface anotacoesProps {
    onShow: () => void;
    carregarAnotacoes: () => void;
    anotacoes: Anotacao[];
    idTicket: number;
}

export const Anotacoes = ({ onShow, carregarAnotacoes, anotacoes, idTicket }: anotacoesProps) => {

    const [desc, setDesc] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const criarAnotacao = async () => {
        try {
            if (!idTicket || !desc?.trim()) {
                setErrorMessage("Campos obrigatórios não preenchidos.");
                return;
            }



            const dados = {
                id_ticket: idTicket,
                id_usuario: 1,
                descricao: desc,
            };

            const res = await chamadasAnotacoes.criarAnotacao(dados);

            setDesc(""); // limpa o campo
            // atualiza a lista de anotações, se tiver
            carregarAnotacoes();

        } catch (err) {
            console.error(err);
            setErrorMessage("Erro ao criar anotação.");
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-300 mb-5 max-w-[1400px]">

            {/* Cabeçalho */}
            <div className="w-[45vw] h-[95vh] flex flex-col">
                <header className="flex flex-row justify-between p-6 gap-2 font-bold text-[#4B4B4B] border-b">
                    <div>

                        <h1 className="text-xl">Anotações</h1>

                    </div>

                    <button onClick={() => onShow()} className="p-4"><X /></button>
                </header>

                <div className="flex flex-col flex-1 overflow-y-auto p-8 space-y-6">
                    {
                        anotacoes.map((anotacao, i) => (
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <div
                                        key={i}
                                        className="flex items-center gap-3">
                                        <div
                                            className={`flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white font-semibold shadow-sm select-none`} >
                                            <span className="text-xs">
                                                {pegarIniciais(anotacao.nome_usuario)}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            {anotacao.nome_usuario}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {formatarDataHora(anotacao.data_hora)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start text-start p-4 bg-gray-50 border-l-2 border-primary rounded-md text-sm text-gray-700 shadow-sm ml-12">
                                    {anotacao.descricao}
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className="border-t bg-gray-50 p-4 flex flex-col gap-3">
                    <textarea
                        className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                        placeholder="Digite sua mensagem..."
                        rows={3}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        onFocus={() => setErrorMessage('')}

                    ></textarea>
                    {errorMessage && <span className="text-xs text-red-700">{errorMessage}</span>}

                    <div className="flex justify-between items-center">

                        <div>
                            <button onClick={criarAnotacao} className="text-sm px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition">
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>







            </div>
        </div>
    )
}