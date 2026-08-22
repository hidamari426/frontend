import { BrowserRouter, Routes, Route } from "react-router-dom";

import InputPage from "../pages/InputPage";
import CalendarPage from "../pages/CalendarPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
