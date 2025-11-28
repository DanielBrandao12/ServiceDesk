
import { useEffect, useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao"
import { Table } from "../../components/table"
import type { Status } from "../../services/types";
import { chamadasStatus } from "../../services/endpoints/status";
import { Edit } from "lucide-react";

import { ModalForm } from "../../components/modalForm";
import Alert from "../../components/alert";


export const StatusView = () => {
    const titulosTabela = ["ID", "Nome", "Situação", "Editar"];

    const [listStatus, setListStatus] = useState<Status[]>([]);
    const [listStatusPaginados, setListStatusPaginados] = useState<Status[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [statusSelecionado, setStatusSelecionado] = useState<Status | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>('');


    const listarStatus = async () => {
        try {
            const res = await chamadasStatus.listarStatus();
            setListStatus(res)
        } catch (err) {
            console.error("Erro ao buscar lista de status", err);
        }
    }
    const editarStatus = async (dados: Status | any) => {
        try {
            await chamadasStatus.editarStatus(dados);
            setMessageAlert('Status editado com sucesso!');
            setShowAlert(true);
            listarStatus();
            setStatusSelecionado(null);
        } catch (err) {
            console.error("Erro ao editar status", err);
        }
    }

    useEffect(() => {
        listarStatus();
        !showEdit && setStatusSelecionado(null)
    }, [showEdit]);

    const handleEdit = (value: Status) => {
        setStatusSelecionado(value)
        setShowEdit(true);
    }
        const criarStatus = async (dados: Status | any) => {
            try {
           
          
                await chamadasStatus.criarStatus(dados);
                setMessageAlert('Status criado com sucesso!');
                setShowAlert(true);
                listarStatus();
                setStatusSelecionado(null)
    
            } catch (err) {
                console.error("Erro ao criar status", err);
            }
        }

    return (
        <PaginaPadrao>
            <Table titlesTable={titulosTabela} title="Status" dados={listStatus} handleSet={setListStatusPaginados} titleButton={"Criar novo status"} onCreate={() => setShowEdit(true)}>
                {listStatusPaginados.map((value, index) => (
                    <tr key={index} className={`text-center text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"} `}>

                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.id_status}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.nome}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.ativo ? "Ativo" : "Inativo"}
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
                    statusSelecionado ? (
                        <ModalForm
                            title="Editar Categoria"
                            setShowEdit={() => setShowEdit(false)}
                            dados={statusSelecionado}
                            setDados={editarStatus}
                        />
                    ) : (
                        <ModalForm
                            title="Criar Categoria"
                            setShowEdit={() => setShowEdit(false)}
                            dados={null}
                            setDados={criarStatus}
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