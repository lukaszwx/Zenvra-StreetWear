import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email) {
      setStatus({ type: "error", message: "Informe seu e-mail." });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Não foi possível enviar o link.");
      }

      setStatus({ type: "success", message: data.message });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f1a21,#050709_55%,#030405)] text-zinc-100 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <Link to="/painel-interno-zenvra" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-300">
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">Recuperar acesso</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Enviaremos um link para redefinir sua senha.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">E-mail</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-emerald-400/70">
              <Mail size={18} className="text-emerald-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                placeholder="admin@email.com"
              />
            </div>
          </label>

          {status.message && (
            <p className={`rounded-2xl border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/30 bg-red-400/10 text-red-300"
            }`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:bg-emerald-300 disabled:opacity-70"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Enviar link
          </button>
        </form>
      </section>
    </main>
  );
}