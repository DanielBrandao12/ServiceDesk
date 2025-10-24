import { useEffect, useState } from "react";
import {  SquareArrowLeft, SquareArrowRight } from "lucide-react";
import Card from "../card/card";


interface tableProps {
  titlesTable: string[];
  title: string;
  children?: React.ReactNode;
  dados: any[];
  handleSet: (dadosPaginados: any[]) => void;
  onCreate:() => void;
  titleButton: string;
}

export const Table = ({
  titlesTable,
  children,
  title,
  dados,
  onCreate,
  handleSet,
  titleButton
}: tableProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPage, setItemPage] = useState<number>(5);

  const indexInicio = (currentPage - 1) * itemPage;
  const indexFim = indexInicio + itemPage;
  const dadosPaginados = dados.slice(indexInicio, indexFim);

  // Atualiza o pai só quando a página ou os dados mudarem
  useEffect(() => {
    handleSet(dadosPaginados);
  }, [dados, currentPage, itemPage]);

  const selectQtde = (qtde: number) => {
    setItemPage(qtde);
    setCurrentPage(1); // volta pra página 1 ao mudar qtde
  };

  return (
    <div className="w-[100%] flex flex-col gap-5 p-20 overflow-scroll">
      {/*Título */}
      <span className="text-titulosTabela font-bold text-xl">{title}</span>

      <Card>
        <div className="flex flex-col">
          <div className="flex mb-10"> 
                  <button className="bg-theadColor p-2 text-white rounded-md px-4 text-sm" onClick={onCreate} >{titleButton}</button>
          </div>

          {/*Tabela */}
          <div>
            <table className="w-[100%] border border-collapse bg-white rounded overflow-hidden shadow-md table-fixed">
              <thead className="bg-theadColor text-[13px] text-white font-bold">
                <tr>
                  {titlesTable.map((title, index) => (
                    <th
                      key={index}
                      className="py-3 text-center border-b border-b-secondary w-[20%] whitespace-nowrap"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>

          {/*Paginação */}
          <div className="flex flex-row justify-between mt-5 text-sm text-[#4B4B4B]">
            <div className="flex items-center gap-2 py-5">
              <span>Exibir</span>
              <select
                onChange={(event) => selectQtde(Number(event.target.value))}
                className="p-1 border border-[#B3B7BC] outline-none rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span>itens por página</span>
            </div>

            <div className="flex flex-row items-center gap-5">
              <SquareArrowLeft
                className={`cursor-pointer ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                size={25}
                onClick={() => {
                  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                }}
              />

              <span>
                Página {currentPage} de{" "}
                {Math.max(1, Math.ceil(dados.length / itemPage))}
              </span>

              <SquareArrowRight
                className={`cursor-pointer ${
                  currentPage >= Math.ceil(dados.length / itemPage)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                size={25}
                onClick={() => {
                  const totalPages = Math.ceil(dados.length / itemPage);
                  if (currentPage < totalPages)
                    setCurrentPage((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
