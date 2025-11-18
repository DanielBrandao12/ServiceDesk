import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  FileText,
  ChartPie,
  UsersRound,
  Shapes,
  Tickets,
  TicketX,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { chamadaLogin } from "../../services/endpoints/login";
import Alert from "../alert";

interface MenuProps {
  expandeMenu: boolean;
  setExpandeMenu: () => void;
}

const Menu = ({ expandeMenu, setExpandeMenu }: MenuProps) => {

  const navigate = useNavigate();

  const [submenuAberto, setSubmenuAberto] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSubmenu = () => {
    setSubmenuAberto(!submenuAberto);
  };

  const logout = async () => {

    try {
      await chamadaLogin.handleLogout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao tentar sair");
    }

  }

  return (
    <div className={`${expandeMenu ? "w-[15%]" : "w-[5%]"} bg-background h-[100vh] transition-all duration-300`}>
      <div className="py-10">

        <div className="flex flex-col justify-center items-center gap-2">

          {/* ITEM DE MENU → Componentizado visualmente, mas SEM remover nada */}
          <div
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="DashBoard"
          >
            <LayoutDashboard
              className="text-white group-hover:scale-110 transition-transform"
              size={25}
              onClick={setExpandeMenu}
            />
            {expandeMenu && (
              <Link className="text-white hidden sm:inline" to={"/"}>
                Dashboard
              </Link>
            )}
          </div>
          <div
            onClick={toggleSubmenu}
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="Tickets"
          >
            <Ticket
              className="text-white group-hover:scale-110 transition-transform"
              size={25}
              onClick={setExpandeMenu}
            />
            {expandeMenu && <span className="text-white hidden sm:inline">Tickets</span>}
          </div>
          {expandeMenu && submenuAberto && (
            <div className="flex flex-col w-4/6 pl-8 gap-1 border-l border-white/20 mt-1">

              <div className="group flex items-center gap-2 cursor-pointer hover:bg-[#7E0000]/80 rounded p-2 transition-all">
                <Tickets className="text-white group-hover:scale-110 transition-transform" size={20} />
                <Link className="text-white text-sm" to={"/TicketsOpen"}>Abertos</Link>
              </div>

              <div className="group flex items-center gap-2 cursor-pointer hover:bg-[#7E0000]/80 rounded p-2 transition-all">
                <TicketX className="text-white group-hover:scale-110 transition-transform" size={20} />
                <Link className="text-white text-sm" to={"/TicketsClose"}>Fechados</Link>
              </div>
            </div>
          )}

          <div
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="Relatórios"
          >
            <FileText className="text-white group-hover:scale-110 transition-transform" size={25} onClick={setExpandeMenu} />
            {expandeMenu && <Link className="text-white hidden sm:inline" to={"/Relatorio"}>Relatórios</Link>}
          </div>

          <div
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="Categorias"
          >
            <Shapes className="text-white group-hover:scale-110 transition-transform" size={25} onClick={setExpandeMenu} />
            {expandeMenu && <Link className="text-white hidden sm:inline" to={"/Categorias"}>Categorias</Link>}
          </div>

          <div
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="Status"
          >
            <ChartPie className="text-white group-hover:scale-110 transition-transform" size={25} onClick={setExpandeMenu} />
            {expandeMenu && <Link className="text-white hidden sm:inline" to={"/Status"}>Status</Link>}
          </div>

          <div
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="Usuários"
          >
            <UsersRound className="text-white group-hover:scale-110 transition-transform" size={25} onClick={setExpandeMenu} />
            {expandeMenu && <Link className="text-white hidden sm:inline" to={"/Usuarios"}>Usuários</Link>}
          </div>

          {
            /*
                <div
                className={`
              group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
              transition-all duration-200
              ${expandeMenu ? "justify-start" : "justify-center"} 
              hover:bg-[#7E0000]/80
            `}
                title="Configurações"
              >
                <Settings className="text-white group-hover:scale-110 transition-transform" size={25} onClick={setExpandeMenu} />
                {expandeMenu && <Link className="text-white hidden sm:inline" to={"/"}>Configurações</Link>}
              </div>
              
             */
          }

          <div
            className={`
          group cursor-pointer flex items-center gap-3 w-4/6 rounded p-2 
          transition-all duration-200
          ${expandeMenu ? "justify-start" : "justify-center"} 
          hover:bg-[#7E0000]/80
        `}
            title="Sair"
          >
            <LogOut className="text-white group-hover:scale-110 transition-transform" size={25} onClick={setExpandeMenu} />
            {expandeMenu && <span className="text-white hidden sm:inline" onClick={() => setShowConfirm(true)}>Sair</span>}
          </div>
        </div>
      </div>

      {
        showConfirm && (
          <Alert
            title="Confirmação"
            message="Tem certeza que deseja sair?"
            onClose={() => setShowConfirm(false)} // cancelar
            onConfirm={() => {
              logout();
            }}
          />
        )
      }
    </div>

  );
};

export default Menu;
