import { forwardRef } from "react";
import { formatarData } from "../../../utils/date";

interface PrintPdfProps {
    dadosRelatorio: any;
}

export const PrintPdf = forwardRef<HTMLDivElement | null, PrintPdfProps>(
    ({ dadosRelatorio }, ref) => {
        if (!dadosRelatorio || !dadosRelatorio.agrupados) {
            return <div ref={ref}>Sem dados para exibir</div>;
        }
        const verificarData = (valor: any): boolean => {
            if (typeof valor !== "string") return false;

            // Aceita formatos tipo "YYYY/MM/DD" ou "YYYY-MM-DD" ou "DD/MM/YYYY"
            const padraoData =
                /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$|^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/;

            if (!padraoData.test(valor.trim())) return false;

            const data = new Date(valor);
            return !isNaN(data.getTime());
        };


        return (
            <div ref={ref} className="p-10 text-sm">
                <h2 className="font-bold text-lg mb-6 text-center">
                    Relatório de Chamados Completo
                </h2>

                {dadosRelatorio?.agrupados && Object.entries(dadosRelatorio.agrupados as Record<string, any[]>).map(
                    ([tipo, tickets]: [string, any[]], index: number) => {
                        //Coleta todos os status únicos encontrados neste grupo
                        const statusUnicos = Array.from(

                            new Set(tickets.map((t) => t.status))
                        );

                        return (
                            <div key={index} className="mb-10">
                                <h3 className="font-semibold text-base mb-2 border-b pb-1">
                                    {

                                        verificarData(tipo) ? formatarData(tipo) : tipo.toUpperCase()
                                    }
                                </h3>

                                <table className="w-[100%] border border-collapse bg-white rounded overflow-hidden shadow-md table-fixed">
                                    <thead className="bg-theadColor text-[13px] text-white font-bold">
                                        <tr >
                                            <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">Status</th>
                                            <th className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap">Quantidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statusUnicos.map((status) => {
                                            const qtd = tickets.filter(
                                                (t) => t.status === status
                                            ).length;

                                            return (
                                                <tr key={status}>
                                                    <td className="border p-2">{status}</td>
                                                    <td className="border p-2 text-center">{qtd}</td>
                                                </tr>
                                            );
                                        })}

                                        <tr className="font-bold bg-gray-100">
                                            <td className="border p-2">Total</td>
                                            <td className="border p-2 text-center">
                                                {tickets.length}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                )}

                {/* Total geral */}
                <div className="mt-6 text-right font-semibold">
                    Total geral de chamados: {dadosRelatorio.totalTickets ?? 0}
                </div>
            </div>
        );
    }
);
