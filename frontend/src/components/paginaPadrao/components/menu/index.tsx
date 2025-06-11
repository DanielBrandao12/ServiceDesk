
import { LayoutDashboard, Ticket, FileText, ChartPie, UsersRound, Settings, Shapes } from "lucide-react";
import { Link } from "react-router-dom";


interface MenuProps {
  expandeMenu: boolean;
}

const Menu = ({ expandeMenu }: MenuProps) => {
  return (

    <div className={`${expandeMenu ? " w-[15%]" : "w-[5%]"} bg-background  h-[100vh] `}>
      <div className="py-10 m-auto">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className={`${expandeMenu ? "justify-start " : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <LayoutDashboard className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white" to={'/'}>Dashboard</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Ticket className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white "  to={'/PageTicket'}>Ticket</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <FileText className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white"  to={'/'}>Relatórios</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Shapes className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white"  to={'/'}>Categorias</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <ChartPie className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white"  to={'/'}>Status</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <UsersRound className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white"  to={'/'}>Usuários</Link>}
          </div>
          <div className={`${expandeMenu ? "justify-start" : "justify-center"} flex flex-row items-center gap-2 w-4/6 cursor-pointer`}>
            <Settings className=" text-white" size={25} />
            {expandeMenu && <Link className="hidden sm:inline text-white"  to={'/'}>Configurações</Link>}
          </div>

        </div>
      </div>
    </div>  
  );
};

export default Menu;
