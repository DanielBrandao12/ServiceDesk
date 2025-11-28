import { Paperclip, X } from "lucide-react";
import Card from "../../components/card/card";
import PaginaPadrao from "../../components/paginaPadrao";
import type { Categoria, Status, Ticket, Usuarios } from "../../services/types";
import { ChamadasTickets } from "../../services/endpoints/tickets";
import { useEffect, useState } from "react";
import { chamadasStatus } from "../../services/endpoints/status";
import { chamadasCategoria } from "../../services/endpoints/categoria";
import { chamadasUsers } from "../../services/endpoints/users";
import { getUserData } from "../../utils/getUser";
import { chamadasAnexo } from "../../services/endpoints/anexo";
import Alert from "../../components/alert";


const NewTicket = () => {
  const user: any = getUserData();

  // ------------------------------
  // Estados principais
  // ------------------------------
  const [nomeRequisitante, setNomeRequisitante] = useState("");
  const [email, setEmail] = useState("");
  const [idCategoria, setIdCategoria] = useState<number>(0);
  const [idStatus, setIdStatus] = useState<number>(0);
  const [atribuidoA, setAtribuidoA] = useState("");
  const [descricao, setDescricao] = useState("");
  const [assunto, setAssunto] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const [arquivos, setArquivos] = useState<File[]>([]);

  // ------------------------------
  // Listas
  // ------------------------------
  const [listStatus, setListStatus] = useState<Status[]>([]);
  const [listCategorias, setListCategorias] = useState<Categoria[]>([]);
  const [listUsers, setListUsers] = useState<Usuarios[]>([]);

  // ------------------------------
  // Mensagens e erros
  // ------------------------------
  const [erros, setErros] = useState<any>({});
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>("");

  // ------------------------------
  // Validação dos campos
  // ------------------------------
  const validarCampos = () => {
    const e: any = {};

    if (!nomeRequisitante.trim())
      e.nomeRequisitante = "O nome do requisitante é obrigatório.";

    if (!email.trim()) {
      e.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@") || !email.includes(".")) {
      e.email = "Informe um e-mail válido.";
    }

    if (!idCategoria) e.idCategoria = "Selecione uma categoria.";
    if (!prioridade) e.prioridade = "Selecione uma prioridade.";
    if (!idStatus) e.idStatus = "Selecione um status.";
    if (!assunto.trim()) e.assunto = "O assunto é obrigatório.";
    if (!descricao.trim()) e.descricao = "A descrição é obrigatória.";

    setErros(e);
    return Object.keys(e).length === 0;
  };

  // ------------------------------
  // Criar Ticket
  // ------------------------------
  const criarTicket = async () => {
    if (!validarCampos()) return;

    try {
      const dados: Omit<
        Ticket,
        "id_ticket" | "codigo_ticket" | "data_criacao" | "ticket"
      > = {
        nome_requisitante: nomeRequisitante,
        email,
        id_categoria: idCategoria,
        id_status: idStatus,
        id_usuario: user.id,
        atribuido_a: atribuidoA,
        descricao,
        assunto,
        nivel_prioridade: prioridade,
      };

      const res = await ChamadasTickets.criarTicket(dados);

      await uploadAnexo(res.ticketCriado.codigo_ticket);

      setMessageAlert("Ticket criado com sucesso!");
      setShowAlert(true);
      limparCampos();
    } catch (err) {
      console.error("Erro ao criar ticket:", err);
      setMessageAlert("Erro ao criar ticket. Tente novamente.");
      setShowAlert(true);
    }
  };

  // ------------------------------
  // Upload de anexos
  // ------------------------------
  const uploadAnexo = async (id_ticket: number) => {
    if (arquivos.length === 0) return;

    const formData = new FormData();
    arquivos.forEach((file) => formData.append("anexos", file));
    formData.append("idTicket", id_ticket.toString());

    try {
      await chamadasAnexo.createAnexo(formData);
      setArquivos([]);
    } catch (err) {
      console.error("Erro ao enviar anexos:", err);
    }
  };

  // ------------------------------
  // Limpar campos após salvar
  // ------------------------------
  const limparCampos = () => {
    setNomeRequisitante("");
    setEmail("");
    setIdCategoria(0);
    setIdStatus(0);
    setAtribuidoA("");
    setDescricao("");
    setAssunto("");
    setPrioridade("");
    setArquivos([]);
  };

  // ------------------------------
  // Buscar listas
  // ------------------------------
  useEffect(() => {
    chamadasStatus.listarStatus().then(setListStatus);
    chamadasCategoria.listarCategorias().then(setListCategorias);
    chamadasUsers.listarUsuarios().then(setListUsers);
  }, []);

  const removerArquivo = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  // --------------------------------------------------------------------
  // RENDERIZAÇÃO
  // --------------------------------------------------------------------

  return (
    <PaginaPadrao>
      <div className="w-full flex flex-col gap-5 p-14 overflow-y-auto">
        <h1 className="text-titulosTabela font-bold text-xl">Novo Ticket</h1>

        <Card>
          <div className="flex flex-col gap-5 p-5">

            {/* Linha 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nome */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Nome Requisitante:
                </label>

                <input
                  value={nomeRequisitante}
                  onChange={(e) => setNomeRequisitante(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                />

                {erros.nomeRequisitante && (
                  <p className="text-red-600 text-xs">{erros.nomeRequisitante}</p>
                )}
              </div>

              {/* Cat + Prioridade */}
              <div className="grid grid-cols-2 gap-4">

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Categoria:
                  </label>

                  <select
                    value={idCategoria || ""}
                    onChange={(e) => setIdCategoria(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Selecione uma opção</option>
                    {listCategorias.map((item) => (
                      <option key={item.id_categoria} value={item.id_categoria}>
                        {item.nome}
                      </option>
                    ))}
                  </select>

                  {erros.idCategoria && (
                    <p className="text-red-600 text-xs">{erros.idCategoria}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Prioridade:
                  </label>

                  <select
                    value={prioridade || ""}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Prioridade Baixa">Baixa</option>
                    <option value="Prioridade Média">Média</option>
                    <option value="Prioridade Alta">Alta</option>
                  </select>

                  {erros.prioridade && (
                    <p className="text-red-600 text-xs">{erros.prioridade}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Email Requisitante:
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                />

                {erros.email && (
                  <p className="text-red-600 text-xs">{erros.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Status:
                  </label>

                  <select
                    value={idStatus || ""}
                    onChange={(e) => setIdStatus(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Selecione uma opção</option>

                    {listStatus.map((item) => (
                      <option key={item.id_status} value={item.id_status}>
                        {item.nome}
                      </option>
                    ))}
                  </select>

                  {erros.idStatus && (
                    <p className="text-red-600 text-xs">{erros.idStatus}</p>
                  )}
                </div>

                {/* Atribuir */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Atribuir:
                  </label>

                  <select
                    value={atribuidoA || ""}
                    onChange={(e) => setAtribuidoA(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Selecione uma opção</option>

                    {listUsers.map((item) => (
                      <option key={item.id_usuario} value={item.id_usuario}>
                        {item.nome_usuario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Assunto */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Assunto:
              </label>

              <input
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />

              {erros.assunto && (
                <p className="text-red-600 text-xs">{erros.assunto}</p>
              )}
            </div>

            {/* Descrição + anexos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Descrição:
                </label>

                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 resize-none"
                />

                {erros.descricao && (
                  <p className="text-red-600 text-xs">{erros.descricao}</p>
                )}
              </div>

              {/* Anexos */}
              <div className="flex flex-col gap-2">

                <label
                  htmlFor="inputAnexo"
                  className="flex items-center justify-center gap-2 bg-[#b20000] hover:bg-[#7E0000] text-white rounded-md px-5 py-2 cursor-pointer"
                >
                  <Paperclip size={18} />
                  Anexar arquivos
                </label>

                <input
                  id="inputAnexo"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    if (files.length > 0) {
                      setArquivos((prev) => [...prev, ...files]);
                    }
                  }}
                />
                <label className="text-sm font-semibold text-gray-600 mb-1">
                  Anexos adicionados:
                </label>

                {arquivos.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {arquivos.map((file, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between border border-gray-300 rounded-lg p-2 w-[120px] h-[90px] shadow-sm"
                      >
                        <button
                          className="text-red-600 self-end"
                          onClick={() => removerArquivo(i)}
                        >
                          <X size={14} />
                        </button>

                        <p className="text-xs truncate text-center">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botão */}
            <div className="flex justify-end mt-6">
              <button
                onClick={criarTicket}
                className="bg-[#b20000] hover:bg-[#7E0000] text-white rounded-md px-8 py-2 font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </Card>

        {showAlert && (
          <Alert
            message={messageAlert}
            onClose={() => setShowAlert(!showAlert)}
          />
        )}
      </div>
    </PaginaPadrao>
  );
};

export default NewTicket;
