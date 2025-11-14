
import { useEffect, useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao"
import { Table } from "../../components/table"
import type { Usuarios } from "../../services/types";

import { Edit } from "lucide-react";

import Alert from "../../components/alert";
import { chamadasUsers } from "../../services/endpoints/users";
import { ModalFormUser } from "./components";
import { getUserData } from "../../utils/getUser";


export const UserView = () => {
    const titulosTabela = ["ID", "Nome", "Email", "Nome usuário", "Perfil", "Editar"];

    const [listUsers, setListUsers] = useState<Usuarios[]>([]);
    const [listUsersPaginados, setListUsersPaginados] = useState<Usuarios[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [userSelecionado, setUserSelecionado] = useState<Usuarios | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>('');
    const user: any = getUserData();

    const listarUsuarios = async () => {
        try {
            const res = await chamadasUsers.listarUsuarios();
            setListUsers(res);
           
        } catch (err) {
            console.error("Erro ao buscar lista de usuários", err);
        }
    }
    const editarUser = async (dados: Usuarios | any) => {
        try {
            await chamadasUsers.editarUsuario(dados);
            setMessageAlert('Usuário editado com sucesso!');
            setShowAlert(true);
            listarUsuarios();
            setUserSelecionado(null);
        } catch (err) {
            console.error("Erro ao editar usuário", err);
        }
    }

    useEffect(() => {
        listarUsuarios();
        !showEdit && setUserSelecionado(null)
    }, [showEdit]);

    const handleEdit = (value: Usuarios) => {
        setUserSelecionado(value)
        setShowEdit(true);
    }
    const criarUser = async (dados: Usuarios | any) => {
        try {
            await chamadasUsers.criarUsuario(dados);
            setMessageAlert('Usuário criado com sucesso!');
            setShowAlert(true);
            listarUsuarios();
            setUserSelecionado(null)

        } catch (err) {
            console.error("Erro ao criar usuário", err);
        }
    }

    return (
        <PaginaPadrao>
            <Table titlesTable={titulosTabela} title="Usuários" dados={listUsers} handleSet={setListUsersPaginados} titleButton={"Criar novo usuário"} onCreate={() => setShowEdit(true)}>
                {listUsersPaginados.map((value, index) => (
                    <tr key={index} className={`text-center text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"} `}>

                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.id_usuario}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.nome_completo}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.email}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.nome_usuario}
                        </td>
                        <td className="py-3  border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {value.perfil}
                        </td>
                        <td
                            onClick={() => value.id_usuario === user.id && handleEdit(value)}
                            className={`py-3 border-b border-b-[#ddd] w-[20%] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer
                                ${value.id_usuario !== user.id ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                        >
                            <div className="flex justify-center items-center">
                                <Edit size={14} />
                            </div>
                        </td>

                    </tr>
                ))}
            </Table>
            {
                showEdit && (
                    userSelecionado ? (
                        <ModalFormUser
                            title="Editar Usuário"
                            setShowEdit={() => setShowEdit(false)}
                            dados={userSelecionado}
                            setDados={editarUser}
                        />
                    ) : (
                        <ModalFormUser
                            title="Criar Usuário"
                            setShowEdit={() => setShowEdit(false)}
                            dados={null}
                            setDados={criarUser}
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