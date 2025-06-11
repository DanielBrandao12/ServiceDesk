
import { LayoutDashboard, Ticket, FileText, ChartPie, UsersRound, Settings, Shapes } from "lucide-react";
import { Link } from "react-router-dom";


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
            {expandeMenu && <Link className="hidden sm:inline" to={'/'}>Dashboard</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Ticket size={25} />
            {expandeMenu && <Link className="hidden sm:inline"  to={'/PageTicket'}>Ticket</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <FileText size={25} />
            {expandeMenu && <Link className="hidden sm:inline"  to={'/'}>Relatórios</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Shapes size={25} />
            {expandeMenu && <Link className="hidden sm:inline"  to={'/'}>Categorias</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <ChartPie size={25} />
            {expandeMenu && <Link className="hidden sm:inline"  to={'/'}>Status</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <UsersRound size={25} />
            {expandeMenu && <Link className="hidden sm:inline"  to={'/'}>Usuários</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Settings size={25} />
            {expandeMenu && <Link className="hidden sm:inline"  to={'/'}>Configurações</Link>}
          </div>

        </div>
      </div>
    </div>  
  );
};

export default Menu;
