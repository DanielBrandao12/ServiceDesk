import { X } from "lucide-react";
import Card from "../../components/card/card";
import { useEffect, useState } from "react";

interface ModalFormProps {
  setShowEdit: () => void;
  title: string;
  dados: any | null;
  setDados: (dadosAtualizado: any) => void;
  modo?: "editar" | "criar";
}

export const ModalForm = ({ setShowEdit, title, dados, setDados, modo = "editar" }: ModalFormProps) => {
  const [dadosEditados, setDadosEditados] = useState<any | null>(dados);
  const [error, setError] = useState<string>('')

  // Se for modo criação, inicializa com valores padrão
  useEffect(() => {
    if (modo === "criar") {
      setDadosEditados({ nome: "", ativo: true });
    } else {
      setDadosEditados(dados);
    }
  }, [dados, modo]);

  const handleSave = () => {
    if(!dadosEditados.nome){
        setError('Campo obrigatório') 
    } else {

        setError('') ;
         setDados(dadosEditados);
         setShowEdit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-4">
        <Card>
          <div className="flex flex-col gap-4 w-[400px] p-5 relative">
            {/* Botão fechar */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              onClick={setShowEdit}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-700">{title}</h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Nome</label>
              <input
                type="text"
                name="nome"
                value={dadosEditados?.nome || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({ ...prev, nome: e.target.value }))
                }
                onFocus={() =>setError('')}
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              />
              {

              error && (
                <span className="text-primary text-sm">{error}</span>
              )
              }
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Situação</label>
              <select
                name="ativo"
                value={dadosEditados?.ativo ? "true" : "false"}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({
                    ...prev,
                    ativo: e.target.value === "true",
                  }))
                }
                className="border border-gray-300 rounded px-2 py-1 outline-none cursor-pointer"
              >
                <option value="true" title="Ativo">
                  Ativo
                </option>
                <option value="false" title="Inativo">
                  Inativo
                </option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="bg-[#b20000] hover:bg-[#7E0000] text-white rounded py-2 mt-4 transition"
            >
              {modo === "criar" ? "Criar Categoria" : "Salvar Alterações"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
