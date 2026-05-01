import { RefreshCw } from "lucide-react";

function ErrorState({ message, onRetry }) {
  return (
    <section id="produtos" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-400/20 bg-red-950/20 p-10">
          <p className="text-lg font-bold text-red-300">
            Não foi possível carregar os produtos.
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            {message || "Tivemos um problema temporário."}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-black text-black transition hover:bg-emerald-300"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    </section>
  );
}

export default ErrorState;