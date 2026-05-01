import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLogin() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await login(email, password);

      if (!res?.token) {
        setError(res?.message || "Erro ao fazer login.");
        return;
      }

      window.location.replace("/painel-interno-zenvra");
    } catch (err) {
      setError(err.message || "Erro ao fazer login.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-80 border border-white/10"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          required
          className="w-full mb-3 p-2 bg-zinc-800 rounded outline-none focus:border-emerald-400 border border-transparent"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          className="w-full mb-4 p-2 bg-zinc-800 rounded outline-none focus:border-emerald-400 border border-transparent"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 transition py-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <Link
          to="/forgot-password"
          className="mt-4 block text-center text-sm text-zinc-400 transition hover:text-emerald-300"
        >
          Esqueci minha senha
        </Link>
      </form>
    </div>
  );
}