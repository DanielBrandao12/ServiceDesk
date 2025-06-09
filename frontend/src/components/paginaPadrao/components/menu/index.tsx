
import { LayoutDashboard, Ticket, FileText, ChartPie, UsersRound, Settings, Shapes } from "lucide-react";

interface MenuProps {
  expandeMenu: boolean;
}

const Menu = ({ expandeMenu }: MenuProps) => {
  return (

    <div className={`${expandeMenu ? "w-[15%]" : "w-[5%]"}  h-[100vh] border`}>
      <div className="py-10 m-auto">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <LayoutDashboard size={25} />
            {expandeMenu && <span className="hidden sm:inline">Dashboard</span>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Ticket size={25} />
            {expandeMenu && <span className="hidden sm:inline">Ticket</span>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <FileText size={25} />
            {expandeMenu && <span className="hidden sm:inline">Relatórios</span>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Shapes size={25} />
            {expandeMenu && <span className="hidden sm:inline">Categorias</span>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <ChartPie size={25} />
            {expandeMenu && <span className="hidden sm:inline">Status</span>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <UsersRound size={25} />
            {expandeMenu && <span className="hidden sm:inline">Usuários</span>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Settings size={25} />
            {expandeMenu && <span className="hidden sm:inline">Configurações</span>}
          </div>

        </div>
      </div>
    </div>  
  );
};

export default Menu;
