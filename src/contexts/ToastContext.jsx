import { createContext, useContext, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Sparkles
} from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const toastVariants = {
  success: {
    icon: Check,
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-400/30",
    iconColor: "text-emerald-400",
    textColor: "text-emerald-100"
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-400/30",
    iconColor: "text-red-400",
    textColor: "text-red-100"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-400/30",
    iconColor: "text-yellow-400",
    textColor: "text-yellow-100"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-400/30",
    iconColor: "text-blue-400",
    textColor: "text-blue-100"
  },
  special: {
    icon: Sparkles,
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-400/30",
    iconColor: "text-purple-400",
    textColor: "text-purple-100"
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toastRefs = useRef({});
  const containerRef = useRef(null);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback((message, options = {}) => {
    const {
      variant = "success",
      duration = 4000,
      persistent = false,
      action = null
    } = options;

    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      variant,
      duration,
      persistent,
      action
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss se não for persistente
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, options) => 
    toast(message, { ...options, variant: "success" }), [toast]
  );

  const error = useCallback((message, options) => 
    toast(message, { ...options, variant: "error" }), [toast]
  );

  const warning = useCallback((message, options) => 
    toast(message, { ...options, variant: "warning" }), [toast]
  );

  const info = useCallback((message, options) => 
    toast(message, { ...options, variant: "info" }), [toast]
  );

  const special = useCallback((message, options) => 
    toast(message, { ...options, variant: "special" }), [toast]
  );

  const dismiss = useCallback((id) => {
    const toastElement = toastRefs.current[id];
    if (toastElement) {
      // Animação de saída
      gsap.to(toastElement, {
        y: -50,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => removeToast(id)
      });
    } else {
      removeToast(id);
    }
  }, [removeToast]);

  const dismissAll = useCallback(() => {
    Object.entries(toastRefs.current).forEach(([id, element]) => {
      if (element) {
        gsap.to(element, {
          y: -50,
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => removeToast(parseInt(id))
        });
      }
    });
  }, [removeToast]);

  // Animações de entrada
  const animateToastIn = useCallback((element, id) => {
    gsap.fromTo(element,
      {
        y: -100,
        opacity: 0,
        scale: 0.8,
        rotationX: 15,
        transformPerspective: 1000
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 0.4,
        ease: "power4.out",
        onComplete: () => {
          // Adicionar hover effect
          gsap.to(element, {
            scale: 1.02,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
    );
  }, []);

  const value = {
    toast,
    success,
    error,
    warning,
    info,
    special,
    dismiss,
    dismissAll,
    toasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div
        ref={containerRef}
        className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: '400px' }}
      >
        {toasts.map((toastItem, index) => {
          const variant = toastVariants[toastItem.variant] || toastVariants.success;
          const Icon = variant.icon;
          
          return (
            <div
              key={toastItem.id}
              ref={el => {
                toastRefs.current[toastItem.id] = el;
                if (el) animateToastIn(el, toastItem.id);
              }}
              className={`pointer-events-auto group relative overflow-hidden rounded-2xl border ${variant.borderColor} ${variant.bgColor} backdrop-blur-sm p-4 shadow-2xl transition-all hover:shadow-3xl`}
              style={{
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform'
              }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${variant.iconColor.replace('text-', 'from-')} ${variant.iconColor.replace('text-', 'to-')} opacity-20 blur-sm`} />
              
              {/* Content */}
              <div className="relative flex items-start gap-3">
                {/* Icon */}
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${variant.bgColor} ${variant.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${variant.textColor} leading-relaxed`}>
                    {toastItem.message}
                  </p>
                  
                  {/* Action button */}
                  {toastItem.action && (
                    <button
                      type="button"
                      onClick={toastItem.action.handler}
                      className={`mt-2 text-xs font-semibold ${variant.iconColor} hover:underline transition-all`}
                    >
                      {toastItem.action.label}
                    </button>
                  )}
                </div>
                
                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => dismiss(toastItem.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${variant.bgColor} ${variant.textColor} hover:opacity-80`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              
              {/* Progress bar (se não for persistente) */}
              {!toastItem.persistent && toastItem.duration > 0 && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-black/20 overflow-hidden">
                  <div 
                    className={`h-full ${variant.iconColor.replace('text-', 'bg-')} opacity-60`}
                    style={{
                      animation: `shrink ${toastItem.duration}ms linear forwards`
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* CSS for progress animation */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
