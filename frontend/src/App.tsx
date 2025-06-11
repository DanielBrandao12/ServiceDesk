import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import PageTicket from "./pages/ticketPage";
import NewTicket from "./pages/newTicket";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/PageTicket" element={<PageTicket />} />
        <Route path="/NewTicket" element={<NewTicket />} />
      </Routes>
    </>
  );
}

export default App;
