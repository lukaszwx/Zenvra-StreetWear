import { Navigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPage() {
  const { authenticated, admin, mustChangePassword } = useAuth();

  if (!authenticated) {
    return <AdminLogin />;
  }

  if (mustChangePassword) {
    return <Navigate to="/forgot-password" replace />;
  }

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0f1a21,#050709_55%,#030405)] px-4 text-zinc-100">
        <section className="w-full max-w-md rounded-3xl border border-red-400/20 bg-red-950/20 p-8 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
            Acesso negado
          </p>

          <h1 className="mt-4 text-2xl font-black text-white">
            Apenas administradores podem acessar este painel.
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Faça login com uma conta administrativa válida.
          </p>
        </section>
      </main>
    );
  }

  return <AdminPanel />;
}