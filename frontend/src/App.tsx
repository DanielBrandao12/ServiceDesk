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
import PrivateRoute from "./components/privateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/"element={<PrivateRoute  element={ <Home />}/>} />
        <Route path="/TicketsOpen" element={<PrivateRoute element={ <TicketsOpen />}/>} />
        <Route path="/TicketsClose" element={<PrivateRoute element={<TicketsClose />}/>} />
        <Route path="/NewTicket" element={<PrivateRoute element={<NewTicket />}/>} />
        <Route path="/Ticket/:idTicket" element={<PrivateRoute element={<Ticket />}/>} />
        <Route path="/Status" element={<PrivateRoute element={<StatusView />}/>} />
        <Route path="/Categorias" element={<PrivateRoute element={<CategoriaView />}/>} />
        <Route path="/Usuarios" element={<PrivateRoute element={<UserView />}/>} />
        <Route path="/Relatorio" element={<PrivateRoute element={<Relatorio />}/>} />
      </Routes>
    </>
  );
}

export default App;
