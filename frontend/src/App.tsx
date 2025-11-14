import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import NewTicket from "./pages/newTicket";
import TicketsOpen from "./pages/ticketOpens";
import TicketsClose from "./pages/TicketsClose";
import Ticket from "./pages/ticket";
import { Login } from "./pages/login";
import {  StatusView } from "./pages/status";
import { CategoriaView } from "./pages/categoria";
import { UserView } from "./pages/user";
import { Relatorio } from "./pages/relatorio";

function App() {
  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/TicketsOpen" element={<TicketsOpen />} />
        <Route path="/TicketsClose" element={<TicketsClose />} />
        <Route path="/NewTicket" element={<NewTicket />} />
        <Route path="/Ticket/:idTicket" element={<Ticket />} />
        <Route path="/Status" element={<StatusView />} />
        <Route path="/Categorias" element={<CategoriaView />} />
        <Route path="/Usuarios" element={<UserView />} />
        <Route path="/Relatorio" element={<Relatorio />} />
      </Routes>
    </>
  );
}

export default App;
