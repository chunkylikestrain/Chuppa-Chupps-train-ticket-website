import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
