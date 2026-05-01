import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useProducts } from "../hooks/useProducts";
import { isAuthenticated, removeToken } from "../services/api";

function AdminPage() {
  const navigate = useNavigate();
  const [adminLogged, setAdminLogged] = useState(isAuthenticated());
  const { retry } = useProducts();

  const handleLogout = () => {
    removeToken();
    setAdminLogged(false);
  };

  const handleGoToStore = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-transparent pt-20">
      <Navbar />

      <main>
        {adminLogged ? (
          <AdminPanel
            onProductsChange={retry}
            onLogout={handleLogout}
            onGoToStore={handleGoToStore}
          />
        ) : (
          <AdminLogin onLogin={() => setAdminLogged(true)} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AdminPage;