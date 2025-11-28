
import { useEffect, useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao"
import { Table } from "../../components/table"
import { Edit } from "lucide-react";

import { ModalForm } from "../../components/modalForm";
import { chamadasCategoria } from "../../services/endpoints/categoria";
import type { Categoria } from "../../services/types";
import { formatarData } from "../../utils/date";
import Alert from "../../components/alert";
import { getUserData } from "../../utils/getUser";


export const CategoriaView = () => {
    const titulosTabela = ["ID", "Nome", "Situação", "Criado por", "Data Criação", "Editar"];

    const [listCategorias, setListCategorias] = useState<Categoria[]>([]);
    const [listCategoriasPaginadas, setListCategoriasPaginadas] = useState<Categoria[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>('');
    const user: any = getUserData();

    const listarCategorias = async () => {
        try {
            const res = await chamadasCategoria.listarCategorias();
            setListCategorias(res)
        } catch (err) {
            console.error("Erro ao buscar lista de categorias", err);
        }
    }
    const editarCategoria = async (dados: Categoria | any) => {
        try {
            await chamadasCategoria.editarCategoria(dados);
            setMessageAlert('Categoria editada com sucesso!');
            setShowAlert(true);
            listarCategorias();
            setCategoriaSelecionada(null);

        } catch (err) {
            console.error("Erro ao editar categoria", err);
        }
    }

    useEffect(() => {
        listarCategorias();
        !showEdit && setCategoriaSelecionada(null)
    }, [showEdit]);

    const handleEdit = (value: Categoria) => {
        setCategoriaSelecionada(value)
        setShowEdit(true);
    }

    const criarCategoria = async (dados: Categoria | any) => {
        try {
       
            const dadosAtualizado = {
                ...dados,
                criado_por: user.nome_usuario
            };
            await chamadasCategoria.criarCategoria(dadosAtualizado);
            setMessageAlert('Categoria criada com sucesso!');
            setShowAlert(true);
            listarCategorias();
            setCategoriaSelecionada(null)

        } catch (err) {
            console.error("Erro ao criar categoria", err);
        }
    }
    return (
        <PaginaPadrao>
            <Table titlesTable={titulosTabela} title="Categorias" dados={listCategorias} handleSet={setListCategoriasPaginadas} titleButton={"Criar nova categoria"} onCreate={() => setShowEdit(true)} >
                {listCategoriasPaginadas.map((value, index) => (
                    <tr key={index} className={`text-center text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"} `}>

                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.id_categoria}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.nome}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.ativo ? "Ativo" : "Inativo"}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.criado_por}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {formatarData(value.data_criacao)}
                        </td>
                        <td onClick={() => handleEdit(value)} className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                            <div className="flex justify-center items-center">
                                <Edit size={14} />
                            </div>
                        </td>

                    </tr>
                ))}
            </Table>

            {
                showEdit && (
                    categoriaSelecionada ? (
                        <ModalForm
                            title="Editar Categoria"
                            setShowEdit={() => setShowEdit(false)}
                            dados={categoriaSelecionada}
                            setDados={editarCategoria}
                        />
                    ) : (
                        <ModalForm
                            title="Criar Categoria"
                            setShowEdit={() => setShowEdit(false)}
                            dados={null}
                            setDados={criarCategoria}
                            modo="criar"
                        />
                    )
                )
            }
            {
                showAlert && (

                    <Alert message={messageAlert} onClose={() => setShowAlert(!showAlert)} />
                )
            }
        </PaginaPadrao>
    )
}