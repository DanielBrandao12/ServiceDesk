import { useState } from "react";

import Menu from "./components/menu";
import Painel from "./components/painel";
import Header from "./components/header";

const PaginaPadrao = ({ children } : any) => {
  const [expandeMenu, setExpandeMenu] = useState<boolean>(false);

  return (
    <div>
      <Header onExpandeMenu={() => setExpandeMenu(!expandeMenu)} />
      <div className="flex flex-row">
        <Menu expandeMenu={expandeMenu} />
        <Painel>{children}</Painel>
      </div>
    </div>
  );
};

export default PaginaPadrao;
