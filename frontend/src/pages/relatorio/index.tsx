import { SquareArrowLeft, SquareArrowRight } from "lucide-react";
import Card from "../../components/card/card";
import PaginaPadrao from "../../components/paginaPadrao";
import { useEffect, useRef, useState } from "react";
import { ChamadaRelatorio } from "../../services/endpoints/relatorio";
import { formatarData } from "../../utils/date";
import { useReactToPrint } from "react-to-print";
import { PrintPdf } from "./components/printPdf";

export const Relatorio = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [dadosRelatorio, setDadosRelatorio] = useState< Record<string, any[]> | null >(null);
    const [carregando, setCarregando] = useState<boolean>(false);


    const [modoSelecao, setModoSelecao] = useState<"select" | "data">("select");

    const [filtros, setFiltros] = useState({
        intervalo: "",
        tipoRelatorio: "",
        dateStart: "",
        dateEnd: "",
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemPage, setItemPage] = useState<number>(5);

    // Paginação
    const indexInicio = (currentPage - 1) * itemPage;
    const indexFim = indexInicio + itemPage;

    // Função para buscar relatório
    const gerarRelatorio = async () => {
        try {
            setCarregando(true);


            console.log("Enviando filtros:", filtros);

            const res = await ChamadaRelatorio.gerarRelatorio(filtros);
            console.log("Resposta do servidor:", res);

            setDadosRelatorio(res);
        } catch (err: any) {

        } finally {
            setCarregando(false);
        }
    };

    // Atualizar número de itens por página
    const selectQtde = (qtde: number) => {
        setItemPage(qtde);
        setCurrentPage(1);
    };

    const handleModoSelecao = (modo: "select" | "data") => {
        setModoSelecao(modo);
        // resetar os campos
        if (modo === "select") {
            setFiltros((prev) => ({ ...prev, dateStart: "", dateEnd: "" }));
        } else {
            setFiltros((prev) => ({ ...prev, intervalo: "" }));
        }
    };

    // Exemplo: busca inicial
    useEffect(() => {
        gerarRelatorio();
    }, []);

      const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatório`,
  });


    return (
        <PaginaPadrao>
            <div className="w-full flex flex-col gap-5 p-20 overflow-scroll">
                <h1 className="text-titulosTabela font-bold text-xl">Relatório</h1>

                <Card>
                    <div className="flex flex-col">
                        {/* Filtros */}
                        <div className="flex flex-row gap-6 mb-10 ">
                            <div className="flex gap-4 items-center">
                                <label className="font-semibold text-sm">Intervalo de datas</label>
                                <div className="flex gap-5 mt-2">
                                    <div>
                                        <input
                                            type="radio"
                                            name="modo"
                                            checked={modoSelecao === "select"}
                                            onChange={() => handleModoSelecao("select")}
                                        />
                                        <select
                                            className="border rounded p-2 text-sm ml-2"
                                            disabled={modoSelecao !== "select"}
                                            value={filtros.intervalo}
                                            onChange={(e) =>
                                                setFiltros((prev) => ({ ...prev, intervalo: e.target.value }))
                                            }
                                        >
                                            <option value="">Escolha uma opção</option>
                                            <option value="hoje">Hoje</option>
                                            <option value="semana">Esta semana</option>
                                            <option value="mes">Este mês</option>
                                            <option value="ano">Este ano</option>
                                            <option value="todos">Todo período</option>
                                        </select>
                                    </div>

                                    <div>
                                        <input
                                            type="radio"
                                            name="modo"
                                            checked={modoSelecao === "data"}
                                            onChange={() => handleModoSelecao("data")}
                                        />
                                        <label className="ml-2">De</label>
                                        <input
                                            type="date"
                                            className="border rounded p-2 text-sm ml-2"
                                            disabled={modoSelecao !== "data"}
                                            value={filtros.dateStart}
                                            onChange={(e) =>
                                                setFiltros((prev) => ({ ...prev, dateStart: e.target.value }))
                                            }
                                        />
                                        <label className="ml-2">Até</label>
                                        <input
                                            type="date"
                                            className="border rounded p-2 text-sm ml-2"
                                            disabled={modoSelecao !== "data"}
                                            value={filtros.dateEnd}
                                            onChange={(e) =>
                                                setFiltros((prev) => ({ ...prev, dateEnd: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="font-semibold text-sm">Tipo de Relatório</label>
                                    <select
                                        className="border rounded p-2 text-sm ml-2"
                                        value={filtros.tipoRelatorio}
                                        onChange={(e) =>
                                            setFiltros((prev) => ({ ...prev, tipoRelatorio: e.target.value }))
                                        }
                                    >
                                        <option value="">Selecione o tipo</option>
                                        <option value="Dia">Por Dia</option>
                                        <option value="Mês">Por Mês</option>
                                        <option value="Técnico">Por Técnico</option>
                                        <option value="Categoria">Por Categoria</option>
                                    </select>
                                </div>

                                <button
                                    className="bg-theadColor p-2 text-white rounded-md px-4 text-sm"
                                    onClick={gerarRelatorio}
                                >
                                    Exibir
                                </button>
                          
                            </div>
                            <div className="flex gap-4 items-center">

                                  <button
                                    className="bg-theadColor p-2 text-white rounded-md px-4 text-sm"
                                    onClick={handlePrint}
                                >
                                    Imprimir Relatório completo
                                </button>
                            </div>
                        </div>

                        {/* Estado de carregamento */}
                        {carregando && (
                            <div className="text-center py-10 text-gray-600">
                                Carregando relatório...
                            </div>
                        )}



                        {/* Tabela */}
                        {!carregando && dadosRelatorio && dadosRelatorio.totalTickets ? (
                            <div>
                                <table className="w-full border border-collapse bg-white rounded overflow-hidden shadow-md table-fixed">
                                    <thead className="bg-theadColor text-[13px] text-white font-bold">
                                        <tr>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                {filtros.tipoRelatorio}
                                            </th>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                Em atendimento
                                            </th>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                Aguardando atendimento
                                            </th>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                Pendente Resposta
                                            </th>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                Suspenso
                                            </th>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                Fechados
                                            </th>
                                            <th className="py-3 text-center border-b border-b-secondary">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dadosRelatorio?.agrupados && Object.entries(dadosRelatorio?.agrupados)
                                            .slice(indexInicio, indexFim) // 👈 aplica o corte para a página atual
                                            .map(([tipo, tickets]: [string, any[]], index) => {
                                                const emAtendimento = tickets.filter(t => t.status === "Em atendimento").length;
                                                const aguardando = tickets.filter(t => t.status === "Aguardando Atendimento").length;
                                                const pendenteResposta = tickets.filter(t => t.status === "Pendente Resposta do Solicitante").length;
                                                const suspenso = tickets.filter(t => t.status === "Suspenso").length;
                                                const fechado = tickets.filter(t => t.status === "Fechado").length;
                                                const total = tickets.length;

                                                return (
                                                    <tr
                                                        key={index}
                                                        className={`text-center text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"}`}
                                                    >
                                                        <td className="p-3 border-b border-b-[#ddd]">{filtros.tipoRelatorio === "Dia" ? formatarData(tipo) : tipo}</td>
                                                        <td className="p-3 border-b border-b-[#ddd]">{emAtendimento}</td>
                                                        <td className="p-3 border-b border-b-[#ddd]">{aguardando}</td>
                                                        <td className="p-3 border-b border-b-[#ddd]">{pendenteResposta}</td>
                                                        <td className="p-3 border-b border-b-[#ddd]">{suspenso}</td>
                                                        <td className="p-3 border-b border-b-[#ddd]">{fechado}</td>
                                                        <td className="p-3 border-b border-b-[#ddd] font-bold">{total}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>

                                </table>
                            </div>
                        ): (
                            <span>
                                Não existe dados para gerar o relatório
                            </span>
                        )}

                        {/* Paginação */}
                        {!carregando && dadosRelatorio && (
                            <div className="flex flex-row justify-between items-center mt-5 text-sm text-[#4B4B4B] flex-wrap gap-3">

                                {/* Seleção de quantidade */}
                                <div className="flex items-center gap-2 py-3">
                                    <span>Exibir</span>
                                    <select
                                        value={itemPage}
                                        onChange={(e) => selectQtde(Number(e.target.value))}
                                        className="p-1 border border-[#B3B7BC] outline-none rounded-md text-sm focus:ring-2 focus:ring-[#b20000]"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                    </select>
                                    <span>itens por página</span>
                                    
                                </div>

                                {/* Paginação */}
                                <div className="flex flex-row items-center gap-5">
                                    <SquareArrowLeft
                                        className={`cursor-pointer transition-all ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-[#b20000]"
                                            }`}
                                        size={25}
                                        onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                                    />

                                    <span>
                                        Página{" "}
                                        <span>{currentPage}</span> de{" "}
                                        <span>{Math.ceil(Object.entries(dadosRelatorio.agrupados).length / itemPage)}</span>
                                    </span>

                                    <SquareArrowRight
                                        className={`cursor-pointer transition-all ${currentPage === Math.ceil(Object.entries(dadosRelatorio.agrupados).length / itemPage)
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:text-[#b20000]"
                                            }`}
                                        size={25}
                                        onClick={() => {
                                            const totalPages = Math.ceil(Object.entries(dadosRelatorio.agrupados).length / itemPage);
                                            if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
                                        }}
                                    />
                                </div>
                                
                            </div>
                        )}
                                
                    </div>
                </Card>
            </div>
            
                <div style={{ display: "none" }}>
                    <PrintPdf
                        ref={componentRef}
                        dadosRelatorio={dadosRelatorio}
                    />
                </div>
            
        </PaginaPadrao>
    );
};
