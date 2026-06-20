import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { RoutineDetailPage } from "./pages/RoutineDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
