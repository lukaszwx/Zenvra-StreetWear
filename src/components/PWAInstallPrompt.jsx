import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Download, 
  X, 
  Smartphone, 
  Star,
  Zap,
  ArrowRight,
  Check
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  const promptRef = useRef(null);
  const buttonRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator.standalone === true);
      const isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);
      const isInstalled = standalone || isInWebAppiOS || isInWebAppChrome;
      
      setIsStandalone(isInstalled);
      setIsInstalled(isInstalled);
      
      // Don't show prompt if already installed
      if (isInstalled) {
        setShowPrompt(false);
        return;
      }
      
      // Check if iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      setIsIOS(isIOSDevice);
      
      // Show prompt after 5 seconds (not on first load)
      const timer = setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show custom install prompt after delay
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      toast.success('🎉 Zenvra instalado com sucesso!', {
        duration: 5000
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, toast]);

  // Animações GSAP
  useEffect(() => {
    if (!showPrompt) return;

    const ctx = gsap.context(() => {
      // Prompt slide in
      gsap.fromTo(promptRef.current,
        { y: 100, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power4.out" }
      );

      // Button pulse
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, promptRef);

    return () => ctx.revert();
  }, [showPrompt]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS instructions
      toast.info('Para instalar no iOS: clique em "Compartilhar" → "Adicionar à Tela de Início"', {
        duration: 8000,
        persistent: true
      });
      return;
    }

    if (!deferredPrompt) {
      toast.error('Instalação não disponível no momento', {
        duration: 3000
      });
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('🎉 Iniciando instalação do Zenvra...', {
          duration: 4000
        });
      } else {
        toast.info('Você pode instalar o app mais tarde', {
          duration: 3000
        });
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      setShowPrompt(false);
      
    } catch (error) {
      console.error('Error during install:', error);
      toast.error('Erro ao instalar app. Tente novamente.', {
        duration: 4000
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    
    // Show reminder after 24 hours
    setTimeout(() => {
      localStorage.removeItem('pwa-prompt-dismissed');
    }, 24 * 60 * 60 * 1000);
  };

  const handleLater = () => {
    setShowPrompt(false);
    
    // Show again after 2 hours
    setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, 2 * 60 * 60 * 1000);
  };

  // Don't render if already installed or not showing
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div
      ref={promptRef}
      className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-4 md:w-96"
    >
      <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 backdrop-blur-xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20">
              <Download className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Instale o Zenvra
              </h3>
              <p className="text-sm text-zinc-400">
                {isIOS ? 'Adicione à tela inicial' : 'App nativo no seu dispositivo'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Acesso rápido</p>
              <p className="text-xs text-zinc-400">Abra com um toque na tela inicial</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50">
              <Star className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Experiência offline</p>
              <p className="text-xs text-zinc-400">Use mesmo sem internet</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50">
              <Smartphone className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Interface nativa</p>
              <p className="text-xs text-zinc-400">Sem barra de endereço, tela cheia</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            ref={buttonRef}
            onClick={handleInstallClick}
            className="flex-1 flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-4 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/30 hover:border-emerald-400/50"
          >
            {isIOS ? (
              <>
                <Smartphone className="h-5 w-5" />
                Adicionar à Tela
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Instalar App
              </>
            )}
          </button>
          
          <button
            onClick={handleLater}
            className="rounded-full border border-zinc-600/30 bg-zinc-800/50 px-4 py-3 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-700/50"
          >
            Depois
          </button>
        </div>

        {/* iOS Instructions */}
        {isIOS && (
          <div className="mt-4 p-3 rounded-2xl border border-blue-400/30 bg-blue-400/10">
            <p className="text-xs text-blue-300">
              <strong>Como instalar:</strong><br />
              1. Toque no ícone "Compartilhar" <span className="text-blue-400">⬆️</span><br />
              2. Role para baixo e toque em "Adicionar à Tela de Início"<br />
              3. Toque em "Adicionar"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
