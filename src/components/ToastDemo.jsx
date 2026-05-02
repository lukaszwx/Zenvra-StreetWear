import { useToast } from "../contexts/ToastContext";

// Componente de demonstração para testar os toasts
export default function ToastDemo() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Produto adicionado à sacola! 🛍️", {
      duration: 4000
    });
  };

  const handleError = () => {
    toast.error("Erro ao carregar produto. Tente novamente.", {
      duration: 5000
    });
  };

  const handleWarning = () => {
    toast.warning("Estoque baixo! Apenas 2 unidades restantes.", {
      duration: 4000
    });
  };

  const handleInfo = () => {
    toast.info("Novos produtos chegaram! Confira as novidades.", {
      duration: 3000
    });
  };

  const handleSpecial = () => {
    toast.special("🎉 Promoção exclusiva: 30% OFF em sneakers!", {
      duration: 6000,
      persistent: true,
      action: {
        label: "Ver promoções",
        handler: () => console.log("Action clicked!")
      }
    });
  };

  const handleMultiple = () => {
    toast.success("Primeiro toast");
    setTimeout(() => toast.info("Segundo toast"), 500);
    setTimeout(() => toast.warning("Terceiro toast"), 1000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
      <div className="rounded-lg border border-white/10 bg-zinc-900/80 backdrop-blur-sm p-3">
        <p className="text-xs text-zinc-400 mb-2">Toast Demo</p>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={handleSuccess}
            className="px-2 py-1 text-xs bg-emerald-400/20 text-emerald-400 rounded hover:bg-emerald-400/30 transition-colors"
          >
            Success
          </button>
          <button
            onClick={handleError}
            className="px-2 py-1 text-xs bg-red-400/20 text-red-400 rounded hover:bg-red-400/30 transition-colors"
          >
            Error
          </button>
          <button
            onClick={handleWarning}
            className="px-2 py-1 text-xs bg-yellow-400/20 text-yellow-400 rounded hover:bg-yellow-400/30 transition-colors"
          >
            Warning
          </button>
          <button
            onClick={handleInfo}
            className="px-2 py-1 text-xs bg-blue-400/20 text-blue-400 rounded hover:bg-blue-400/30 transition-colors"
          >
            Info
          </button>
          <button
            onClick={handleSpecial}
            className="px-2 py-1 text-xs bg-purple-400/20 text-purple-400 rounded hover:bg-purple-400/30 transition-colors"
          >
            Special
          </button>
          <button
            onClick={handleMultiple}
            className="px-2 py-1 text-xs bg-zinc-600/20 text-zinc-400 rounded hover:bg-zinc-600/30 transition-colors"
          >
            Multiple
          </button>
        </div>
      </div>
    </div>
  );
}
