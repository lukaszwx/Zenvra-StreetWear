import { RotateCcw } from "lucide-react";

function EmptyState({ onClear }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-zinc-900/40 p-10 text-center">
      <p className="text-lg font-bold text-white">Nenhum produto encontrado.</p>

      <p className="mt-2 text-sm text-zinc-400">
        Tente mudar os filtros ou buscar outro nome.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-bold text-white transition hover:border-emerald-300/60 hover:bg-white/5"
      >
        <RotateCcw className="h-4 w-4" />
        Limpar filtros
      </button>
    </div>
  );
}

export default EmptyState;