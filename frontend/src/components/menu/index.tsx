import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  FileText,
  ChartPie,
  UsersRound,
  Settings,
  Shapes,
  Tickets,
  TicketX,
} from "lucide-react";
import { Link } from "react-router-dom";

interface MenuProps {
  expandeMenu: boolean;
}

const Menu = ({ expandeMenu }: MenuProps) => {
  const [submenuAberto, setSubmenuAberto] = useState(false);

  const toggleSubmenu = () => {
    setSubmenuAberto(!submenuAberto);
  };

  return (
    <div className={`${expandeMenu ? "w-[15%]" : "w-[5%]"} bg-background h-[100vh]`}>
      <div className="py-10 ">
        <div className="flex flex-col justify-center items-center gap-6">
          {/* Dashboard */}
          <div
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <LayoutDashboard className="text-white" size={25} />
            {expandeMenu && (
              <Link className="hidden sm:inline text-white" to={"/"}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Ticket + submenu toggle */}
          <div
            onClick={toggleSubmenu}
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <Ticket className="text-white" size={25} />
            {expandeMenu && (
              <span className="hidden sm:inline text-white">Tickets</span>
            )}
          </div>

          {/* Submenu - Abertos e Fechados */}
          {expandeMenu && submenuAberto && (
            <div className="flex flex-col items-start  w-4/6 pl-8 gap-2 ">
              <div className="flex flex-row items-center gap-2 w-4/6 cursor-pointer">
                <Tickets className="text-white" size={25} />
              <Link className="text-white text-sm" to={"/TicketsOpen"}>
                Abertos
              </Link>
                </div>
                <div className="flex flex-row items-center gap-2 w-4/6 cursor-pointer">
                <TicketX className="text-white" size={25} />
              <Link className="text-white text-sm" to={"/TicketsClose"}>
                Fechados
              </Link>
                  </div>
            </div>
          )}

          {/* Outros itens */}
          <div
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <FileText className="text-white" size={25} />
            {expandeMenu && (
              <Link className="hidden sm:inline text-white" to={"/"}>
                Relatórios
              </Link>
            )}
          </div>

          <div
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <Shapes className="text-white" size={25} />
            {expandeMenu && (
              <Link className="hidden sm:inline text-white" to={"/Categorias"}>
                Categorias
              </Link>
            )}
          </div>

          <div
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <ChartPie className="text-white" size={25} />
            {expandeMenu && (
              <Link className="hidden sm:inline text-white" to={"/Status"}>
                Status
              </Link>
            )}
          </div>

          <div
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <UsersRound className="text-white" size={25} />
            {expandeMenu && (
              <Link className="hidden sm:inline text-white" to={"/Usuarios"}>
                Usuários
              </Link>
            )}
          </div>

          <div
            className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}
          >
            <Settings className="text-white" size={25} />
            {expandeMenu && (
              <Link className="hidden sm:inline text-white" to={"/"}>
                Configurações
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
