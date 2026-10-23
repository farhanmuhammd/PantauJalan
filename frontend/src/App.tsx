import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/client/home/Index";
import ReportPage from "./pages/client/reports/ReportPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pengaduan" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}