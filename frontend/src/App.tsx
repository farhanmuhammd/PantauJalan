import { Navigate, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/client/home/Index";
import ReportPage from "./pages/client/reports/ReportPage";
import NavigasiPage from "./pages/client/navigation/NavigasiPage";
import AdminLoginPage from "./pages/admin/pages/AdminLoginPage";
import AdminProtectedRoute from "./pages/admin/components/AdminProtectedRoute";
import AdminDashboardPage from "./pages/admin/pages/AdminDashboardPage";
import ForbiddenPage from "./pages/admin/pages/ForbiddenPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pengaduan" element={<ReportPage />} />
        <Route path="/navigasi" element={<NavigasiPage />} />
      </Route>

      {/* Halaman autentikasi admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Halaman yang memerlukan sesi admin */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/* Halaman akses ditolak */}
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Halaman tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}