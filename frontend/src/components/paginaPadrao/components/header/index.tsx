import { Menu, Bell, CircleUser, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onExpandeMenu: () => void;
}

const Header = ({onExpandeMenu}: HeaderProps) => {
  const sizeIcons = 25;

  const [closeIcon, setCloseIcon] = useState<boolean>(false);

  const handleClickExpandeMenu = () => {
    onExpandeMenu();
    setCloseIcon(prev => !prev);
  };

  return (
    <div className="flex flex-row justify-between py-3 border shadow-sm">
      <div className="flex items-center justify-center p-5"> 
        {closeIcon ? <X size={sizeIcons} onClick={handleClickExpandeMenu} className="cursor-pointer"/> : <Menu onClick={handleClickExpandeMenu} size={sizeIcons} className="cursor-pointer"/>}
      </div>
      <div className="flex flex-row justify-around items-center w-[30%]">
        <button className="bg-red-700 p-2 text-white rounded-md px-4">Novo Ticket</button>
        <Bell size={sizeIcons} />
        <div className="flex flex-row items-center gap-5">
          <CircleUser size={sizeIcons} />
          <span>User 001</span>
          <ChevronDown size={sizeIcons} />
        </div>
      </div>
    </div>
  );
}

export default Header;
