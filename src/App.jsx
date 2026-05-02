import { Navigate, Route, Routes } from "react-router-dom";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import AdminPage from "./pages/AdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StorePage from "./pages/StorePage";
import GlobalLoading from "./components/GlobalLoading";

export default function App() {
  return (
    <>
      <GlobalLoading />
      <Routes>
        <Route path="/" element={<StorePage />} />

        <Route path="/painel-interno-zenvra" element={<AdminPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}