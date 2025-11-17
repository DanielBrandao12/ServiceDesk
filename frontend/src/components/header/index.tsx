import { Menu, CircleUser, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getUserData } from "../../utils/getUser";

interface HeaderProps {
  onExpandeMenu: () => void;
  expandeMenu: boolean;
}

const Header = ({ onExpandeMenu, expandeMenu }: HeaderProps) => {
  const sizeIcons = 25;

  const navigate = useNavigate();
  const user: any = getUserData();

  const handleNewTicket = () => {
    navigate('/NewTicket')
  }



  return (
    <div className="flex flex-row justify-between py-3 border shadow-md z-999">
      <div className="flex items-center justify-center p-5">
        {expandeMenu ? <X size={sizeIcons} onClick={onExpandeMenu} className="cursor-pointer" /> : <Menu onClick={onExpandeMenu} size={sizeIcons} className="cursor-pointer" />}
      </div>
      <div className="flex flex-row justify-around items-center w-[30%]">
        <button className="bg-background p-2 text-white rounded-md px-4" onClick={handleNewTicket}>Novo Ticket</button>
        <div className="flex flex-row items-center gap-5">
          <CircleUser size={sizeIcons} />
          <span>{user ? user?.nome_usuario : "Sem nome"}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
