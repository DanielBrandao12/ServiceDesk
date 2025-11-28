import { useState } from "react";

import Menu from "../menu";
import Painel from "../painel";
import Header from "../header";

const PaginaPadrao = ({ children } : any) => {
  const [expandeMenu, setExpandeMenu] = useState<boolean>(false);

  return (
    <div>
      <Header onExpandeMenu={() => setExpandeMenu(!expandeMenu)} expandeMenu={expandeMenu}/>
      <div className="flex flex-row">
        <Menu expandeMenu={expandeMenu} setExpandeMenu={() => setExpandeMenu(!expandeMenu)}/>
        <Painel>{children}</Painel>
      </div>
    </div>
  );
};

export default PaginaPadrao;
