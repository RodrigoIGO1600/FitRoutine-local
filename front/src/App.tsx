import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DesktopLayout } from "./components/DesktopLayout";
import { HomePage } from "./pages/HomePage";
import { RoutineSummaryPage } from "./pages/RoutineSummaryPage";
import { RoutineDetailPage } from "./pages/RoutineDetailPage";
import { WorkoutSessionPage } from "./pages/WorkoutSessionPage";
import { HistoryPage } from "./pages/HistoryPage";
import { CreateExercisePage } from "./pages/CreateExercisePage";

function App() {
  return (
    <BrowserRouter>
      <DesktopLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/exercises/new" element={<CreateExercisePage />} />
          <Route path="/routines/:id" element={<RoutineSummaryPage />} />
          <Route path="/routines/:id/edit" element={<RoutineDetailPage />} />
          <Route path="/routines/:id/workout" element={<WorkoutSessionPage />} />
        </Routes>
      </DesktopLayout>
    </BrowserRouter>
  );
}

export default App;
