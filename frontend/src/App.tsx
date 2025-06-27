import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import NewTicket from "./pages/newTicket";
import TicketsOpen from "./pages/ticketOpens";
import TicketsClose from "./pages/TicketsClose";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TicketsOpen" element={<TicketsOpen />} />
        <Route path="/TicketsClose" element={<TicketsClose />} />
        <Route path="/NewTicket" element={<NewTicket />} />
      </Routes>
    </>
  );
}

export default App;
