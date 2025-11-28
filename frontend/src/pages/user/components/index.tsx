import { X } from "lucide-react";
import Card from "../../../components/card/card";
import { useEffect, useState } from "react";

interface ModalFormUserProps {
  setShowEdit: () => void;
  title: string;
  dados: any | null;
  setDados: (dadosAtualizado: any) => void;
  modo?: "editar" | "criar";
}

export const ModalFormUser = ({
  setShowEdit,
  title,
  dados,
  setDados,
  modo = "editar",
}: ModalFormUserProps) => {
  const [dadosEditados, setDadosEditados] = useState<any | null>(dados);
  const [error, setError] = useState<string>("");

  // Valores padrão no modo de criação
  useEffect(() => {
    if (modo === "criar") {
      setDadosEditados({
        nome: "",
        email: "",
        nome_usuario: "",
        perfil: "comum",
        senha: "",
        confirmarSenha: "",
      });
    } else {
      setDadosEditados({
        ...dados,
        senha: "",
        confirmarSenha: "",
      });
    }
  }, [dados, modo]);

  const handleSave = () => {
    if (!dadosEditados.nome_completo || !dadosEditados.email || !dadosEditados.nome_usuario || !dadosEditados.perfil) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }
if (modo === "criar" && !dadosEditados.senha) {
      setError("A senha é obrigatória para novos usuários.");
      return;
    }

    if (dadosEditados.senha !== dadosEditados.confirmarSenha) {
      setError("As senhas não conferem.");
      return;
    }

    setError("");
    const dadosParaSalvar = { ...dadosEditados };
    delete dadosParaSalvar.confirmarSenha; // não envia confirmação
    setDados(dadosParaSalvar);
    setShowEdit();
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

            {/* Campo Nome */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Nome</label>
              <input
                type="text"
                name="nome"
                value={dadosEditados?.nome_completo || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({ ...prev, nome_completo: e.target.value }))
                }
                onFocus={() => setError("")}
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              />
            </div>

            {/* Campo Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={dadosEditados?.email || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({ ...prev, email: e.target.value }))
                }
                onFocus={() => setError("")}
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              />
            </div>

            {/* Campo Nome de Usuário */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Nome de Usuário</label>
              <input
                type="text"
                name="usuario"
                value={dadosEditados?.nome_usuario || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({ ...prev, nome_usuario: e.target.value }))
                }
                onFocus={() => setError("")}
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              />
            </div>
             {/* Senha */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Senha</label>
              <input
                type="password"
                name="senha"
                value={dadosEditados?.senha || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({ ...prev, senha: e.target.value }))
                }
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              />
            </div>

            {/* Confirmar Senha */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Confirmar Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                value={dadosEditados?.confirmarSenha || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({
                    ...prev,
                    confirmarSenha: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              />
            </div>

            {/* Erro */}
            {error && <span className="text-primary text-sm">{error}</span>}

            {/* Campo Perfil */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Perfil</label>
              <select
                name="perfil"
                value={dadosEditados?.perfil || ""}
                onChange={(e) =>
                  setDadosEditados((prev: any) => ({ ...prev, perfil: e.target.value }))
                }
                className="border border-gray-300 rounded px-2 py-1 outline-none cursor-pointer"
              >
                <option value="">Selecione um perfil</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente">Gerente</option>
                <option value="Atendente">Atendente</option>
                <option value="Usuário">Usuário</option>
              </select>
            </div>

          
            {error && <span className="text-primary text-sm">{error}</span>}

            <button
              onClick={handleSave}
              className="bg-[#b20000] hover:bg-[#7E0000] text-white rounded py-2 mt-4 transition"
            >
              {modo === "criar" ? "Criar Usuário" : "Salvar Alterações"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
