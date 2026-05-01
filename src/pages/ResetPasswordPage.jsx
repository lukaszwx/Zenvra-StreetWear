import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { logout } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token"), [params]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!token) {
      setStatus({ type: "error", message: "Token inválido ou ausente." });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "A senha precisa ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "As senhas não conferem.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Não foi possível redefinir a senha."
        );
      }

      // limpa sessão corretamente
      logout();

      setStatus({
        type: "success",
        message: "Senha redefinida com sucesso. Redirecionando...",
      });

      setTimeout(() => {
        navigate("/painel-interno-zenvra");
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-zinc-100 bg-[radial-gradient(circle_at_top,#0f1a21,#050709_55%,#030405)]">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <Link
          to="/painel-interno-zenvra"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-emerald-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Nova senha
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Crie uma nova senha segura
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">
              Nova senha
            </span>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-emerald-400/70">
              <LockKeyhole size={18} className="text-emerald-300" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-zinc-600"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">
              Confirmar senha
            </span>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-emerald-400/70">
              <LockKeyhole size={18} className="text-emerald-300" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-zinc-600"
                placeholder="Repita a nova senha"
              />
            </div>
          </label>

          {status.message && (
            <p
              className={`rounded-2xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-red-400/30 bg-red-400/10 text-red-300"
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.35)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <Loader2 size={18} className="animate-spin" />
            )}
            Redefinir senha
          </button>
        </form>
      </section>
    </main>
  );
}