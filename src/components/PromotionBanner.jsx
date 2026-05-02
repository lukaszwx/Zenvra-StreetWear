import { useState, useEffect, useRef } from "react";
import { fetchActivePromotions } from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sparkles, 
  Zap, 
  Gift, 
  Star, 
  X, 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock,
  Tag,
  Percent
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function PromotionBanner() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [likedPromos, setLikedPromos] = useState(new Set());
  const [savedPromos, setSavedPromos] = useState(new Set());
  const [shareState, setShareState] = useState('idle');
  
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const modalRef = useRef(null);
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    loadPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length === 0) return;

    // Limpar ScrollTriggers anteriores
    scrollTriggersRef.current.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    scrollTriggersRef.current = [];

    // Animações GSAP Apple-style
    const ctx = gsap.context(() => {
      // Animação de entrada dos cards
      gsap.fromTo(cardRefs.current.filter(Boolean),
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: "power3.out",
          stagger: 0.15
        }
      );

      // Parallax suave nos cards
      cardRefs.current.filter(Boolean).forEach((card, index) => {
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            gsap.to(card, {
              y: self.progress * -20,
              ease: "none"
            });
          }
        });
        scrollTriggersRef.current.push(trigger);
      });

    }, containerRef);

    return () => {
      scrollTriggersRef.current.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, [promotions]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await fetchActivePromotions();
      // Garantir que promotions seja sempre um array
      setPromotions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar promoções:', err);
      setError('Não foi possível carregar as promoções');
      setPromotions([]); // Garantir array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (promoId) => {
    setLikedPromos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(promoId)) {
        newSet.delete(promoId);
      } else {
        newSet.add(promoId);
      }
      return newSet;
    });
  };

  const handleSave = (promoId) => {
    setSavedPromos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(promoId)) {
        newSet.delete(promoId);
      } else {
        newSet.add(promoId);
      }
      return newSet;
    });
  };

  const handleShare = async (promo) => {
    setShareState('sharing');
    
    try {
      const text = `Confira esta promoção na Zenvra: ${promo.title} - ${promo.description}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Promoção Zenvra',
          text,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${text} - ${window.location.href}`);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch (err) {
      console.log('Share failed:', err);
      setShareState('idle');
    }
  };

  const formatDiscount = (promo) => {
    if (promo.discountType === 'percentage') {
      return `${promo.discountValue}% OFF`;
    }
    return `R$ ${promo.discountValue} OFF`;
  };

  const formatEndDate = (endDate) => {
    const date = new Date(endDate);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm mb-8">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Carregando promoções...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-3xl bg-zinc-800/50 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 backdrop-blur-sm mb-8">
            <X className="h-4 w-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">{error}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      id="promocoes" 
      className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-emerald-400/5 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-emerald-300/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm mb-6">
            <Tag className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Promoções Exclusivas</span>
          </div>
          
          <h2 className="text-4xl font-black leading-tight text-[#f3f4f6] sm:text-5xl mb-6">
            Ofertas que não pode
            <span className="block text-emerald-400">perder.</span>
          </h2>
          
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Aproveite condições especiais em produtos selecionados. 
            Promoções por tempo limitado com descontos imperdíveis.
          </p>
        </div>

        {/* Promoções Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(promotions) && promotions.map((promo, index) => (
            <div
              key={promo.id}
              ref={el => cardRefs.current[index] = el}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-emerald-400/10"
            >
              {/* Glow effect */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-emerald-400/10 via-emerald-300/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Badge de desconto */}
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                  <Percent className="h-3 w-3" />
                  {formatDiscount(promo)}
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleLike(promo.id)}
                  aria-pressed={likedPromos.has(promo.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      likedPromos.has(promo.id) ? 'fill-red-500 text-red-500' : 'text-white'
                    }`} 
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(promo.id)}
                  aria-pressed={savedPromos.has(promo.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <Bookmark 
                    className={`h-4 w-4 transition-colors ${
                      savedPromos.has(promo.id) ? 'fill-emerald-400 text-emerald-400' : 'text-white'
                    }`} 
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(promo)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <Share2 className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl bg-zinc-800/50">
                  {promo.image ? (
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center">
                      <Gift className="h-12 w-12 text-zinc-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {promo.title}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-3">
                      {promo.description}
                    </p>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Até {formatEndDate(promo.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-emerald-400" />
                      <span>Exclusivo</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className="w-full rounded-full bg-emerald-400 px-4 py-2 font-bold text-black transition-all hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/25 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1a21]"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>

              {/* Share feedback */}
              {shareState === 'copied' && (
                <div className="absolute bottom-4 left-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                  Link copiado!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {(!Array.isArray(promotions) || promotions.length === 0) && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-600/30 bg-zinc-800/50 px-4 py-2 backdrop-blur-sm mb-6">
              <Tag className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-400">Nenhuma promoção ativa</span>
            </div>
            <p className="text-zinc-400">
              Fique de olho! Em breve teremos novas ofertas exclusivas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
