import { Routes, Route, Navigate } from "react-router-dom";
import EstimatorPage from "./pages/EstimatorPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";

function RequireAdminToken({ children }) {
  const token = localStorage.getItem("wantace_admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EstimatorPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdminToken>
            <AdminDashboardPage />
          </RequireAdminToken>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
