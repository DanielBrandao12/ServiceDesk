import { Menu, Bell, CircleUser, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUserData } from "../../utils/getUser";

interface HeaderProps {
  onExpandeMenu: () => void;
}

const Header = ({ onExpandeMenu }: HeaderProps) => {
  const sizeIcons = 25;

  const [closeIcon, setCloseIcon] = useState<boolean>(false);

  const navigate = useNavigate();
  const user: any = getUserData();
  const handleClickExpandeMenu = () => {
    onExpandeMenu();
    setCloseIcon(prev => !prev);
  };

  const handleNewTicket = () => {
    navigate('/NewTicket')
  }



  return (
    <div className="flex flex-row justify-between py-3 border shadow-md z-999">
      <div className="flex items-center justify-center p-5">
        {closeIcon ? <X size={sizeIcons} onClick={handleClickExpandeMenu} className="cursor-pointer" /> : <Menu onClick={handleClickExpandeMenu} size={sizeIcons} className="cursor-pointer" />}
      </div>
      <div className="flex flex-row justify-around items-center w-[30%]">
        <button className="bg-background p-2 text-white rounded-md px-4" onClick={handleNewTicket}>Novo Ticket</button>
        <Bell size={sizeIcons} />
        <div className="flex flex-row items-center gap-5">
          <CircleUser size={sizeIcons} />
          <span>{user ? user?.nome_usuario : "Sem nome"}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
