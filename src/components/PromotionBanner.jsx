import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { fetchActivePromotions } from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Sparkles, Zap, Gift, Star, X, ArrowLeft } from "lucide-react";

// Registrar plugins GSAP
gsap.registerPlugin(ScrollTrigger, Flip);

// Tipo para os cards de promoção
const PromotionCard = {
  id: '',
  title: '',
  price: 0,
  image: '',
  discountType: '',
  discountValue: 0,
  description: '',
  endDate: '',
  minOrderValue: null,
  maxUses: null,
  currentUses: 0
};

export default function PromotionBanner() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const imageRefs = useRef([]);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const flipStateRef = useRef(null);

  useEffect(() => {
    // Detectar mobile e prefers-reduced-motion
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', checkReducedMotion);
    };
  }, []);

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

    // Estado inicial dos cards
    gsap.set(cardRefs.current.filter(Boolean), {
      opacity: 0,
      y: 40,
      scale: 0.95,
      willChange: 'transform, opacity'
    });

    // ScrollTrigger para revelação animada
    const scrollTrigger = ScrollTrigger.batch(cardRefs.current.filter(Boolean), {
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: prefersReducedMotion ? 0.1 : 0.8,
        ease: prefersReducedMotion ? "none" : "power3.out",
        stagger: prefersReducedMotion ? 0 : 0.08,
        onComplete: () => {
          gsap.set(batch, { willChange: 'auto' });
        }
      }),
      once: true
    });
    
    if (scrollTrigger) {
      scrollTriggersRef.current.push(scrollTrigger);
    }

    // Hover avançado (desabilitado em mobile)
    if (!isMobile) {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out",
            willChange: 'transform'
          });

          // Zoom na imagem
          const image = imageRefs.current[index];
          if (image) {
            gsap.to(image, {
              scale: 1.1,
              duration: 0.4,
              ease: "power2.out"
            });
          }

          // Gradient overlay fade-in
          const overlay = card.querySelector('[data-overlay]');
          if (overlay) {
            gsap.to(overlay, {
              opacity: 0.3,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(card, { willChange: 'auto' });
            }
          });

          const image = imageRefs.current[index];
          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out"
            });
          }

          const overlay = card.querySelector('[data-overlay]');
          if (overlay) {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup
        return () => {
          card.removeEventListener('mouseenter', handleMouseEnter);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }

    return () => {
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger && typeof trigger.kill === 'function') {
          trigger.kill();
        }
      });
      scrollTriggersRef.current = [];
      gsap.killTweensOf(cardRefs.current);
      gsap.killTweensOf(imageRefs.current);
    };
  }, [promotions, isMobile, prefersReducedMotion]);

  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  const currentPromotion = useMemo(() => {
    return promotions[currentIndex] || null;
  }, [promotions, currentIndex]);

  const handleCardClick = useCallback((promotion, event, cardElement) => {
    if (isMobile) {
      // Tap animation para mobile
      gsap.to(cardElement, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
      return;
    }

    // Salvar estado Flip
    Flip.getState(cardElement);
    
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  }, [isMobile]);

  const closeModal = useCallback(() => {
    if (modalRef.current && flipStateRef.current) {
      Flip.from(flipStateRef.current, {
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          setIsModalOpen(false);
          setSelectedPromotion(null);
        }
      });
    } else {
      setIsModalOpen(false);
      setSelectedPromotion(null);
    }
  }, []);

  const LazyImage = useCallback(({ src, alt, className, refProp }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (refProp && imgRef.current) {
        refProp.current = imgRef.current;
      }
    }, [refProp]);

    return (
      <div ref={imgRef} className={className}>
        {isInView && (
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700 animate-pulse" />
        )}
      </div>
    );
  }, []);

  async function loadPromotions() {
    try {
      setError(null);
      const data = await fetchActivePromotions();
      setPromotions(data.promotions || []);
    } catch (error) {
      console.error("Erro ao carregar promoções:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getDiscountIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <Zap className="h-6 w-6" />;
      case 'fixed':
        return <Gift className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getDiscountColor = (type) => {
    switch (type) {
      case 'percentage':
        return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      case 'fixed':
        return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      default:
        return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30';
    }
  };

  const getDiscountTextColor = (type) => {
    switch (type) {
      case 'percentage':
        return 'text-emerald-400';
      case 'fixed':
        return 'text-cyan-400';
      default:
        return 'text-emerald-400';
    }
  };

  // Função para garantir decodificação correta de caracteres especiais
  const decodeText = (text) => {
    if (!text) return text;
    try {
      // Decodificar entidades HTML e garantir UTF-8
      const decoded = text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&aacute;/g, 'á')
        .replace(/&eacute;/g, 'é')
        .replace(/&iacute;/g, 'í')
        .replace(/&oacute;/g, 'ó')
        .replace(/&uacute;/g, 'ú')
        .replace(/&Aacute;/g, 'Á')
        .replace(/&Eacute;/g, 'É')
        .replace(/&Iacute;/g, 'Í')
        .replace(/&Oacute;/g, 'Ó')
        .replace(/&Uacute;/g, 'Ú')
        .replace(/&ccedil;/g, 'ç')
        .replace(/&Ccedil;/g, 'Ç')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&agrave;/g, 'à')
        .replace(/&egrave;/g, 'è')
        .replace(/&igrave;/g, 'ì')
        .replace(/&ograve;/g, 'ò')
        .replace(/&ugrave;/g, 'ù')
        .replace(/&atilde;/g, 'ã')
        .replace(/&otilde;/g, 'õ')
        .replace(/&Atilde;/g, 'Ã')
        .replace(/&Otilde;/g, 'Õ')
        .replace(/&auml;/g, 'ä')
        .replace(/&euml;/g, 'ë')
        .replace(/&iuml;/g, 'ï')
        .replace(/&ouml;/g, 'ö')
        .replace(/&uuml;/g, 'ü')
        .replace(/&Auml;/g, 'Ä')
        .replace(/&Euml;/g, 'Ë')
        .replace(/&Iuml;/g, 'Ï')
        .replace(/&Ouml;/g, 'Ö')
        .replace(/&Uuml;/g, 'Ü')
        .replace(/&ordf;/g, 'ª')
        .replace(/&ordm;/g, 'º')
        .replace(/&sect;/g, '§')
        .replace(/&copy;/g, '©')
        .replace(/&reg;/g, '®')
        .replace(/&deg;/g, '°')
        .replace(/&plusmn;/g, '±')
        .replace(/&para;/g, '¶')
        .replace(/&middot;/g, '·')
        .replace(/&euro;/g, '€')
        .replace(/&pound;/g, '£')
        .replace(/&yen;/g, '¥');
      
      return decoded;
    } catch (error) {
      console.warn('Erro ao decodificar texto:', error);
      return text;
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-700 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || promotions.length === 0) {
    return null;
  }

  return (
    <>
      <div 
        ref={containerRef} 
        className="py-12 px-4"
        style={{
          background: 'radial-gradient(circle at top left, #0f1a21 0%, #050709 45%, #030405 100%)'
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
              Ofertas Especiais
              <Star className="h-8 w-8 text-emerald-400 animate-pulse" />
            </h2>
            <p className="text-zinc-400 text-lg">Aproveite nossas promoções exclusivas!</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion, index) => (
              <div
                key={promotion.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative group cursor-pointer transform transition-all duration-500 ${
                  index === currentIndex ? 'z-10' : 'z-0'
                }`}
                onClick={(e) => handleCardClick(promotion, e, cardRefs.current[index])}
              >
                {/* Card principal */}
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getDiscountColor(promotion.discountType)} backdrop-blur-sm p-8 shadow-2xl border border-white/10`}>
                  {/* Gradient overlay para hover */}
                  <div 
                    data-overlay 
                    className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300"
                  />

                  {/* Imagem com lazy loading */}
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                    <LazyImage
                      src={promotion.bannerImage || `https://picsum.photos/seed/${promotion.id}/400/200.jpg`}
                      alt={promotion.title}
                      className="w-full h-full object-cover"
                      refProp={(el) => (imageRefs.current[index] = el)}
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="relative z-10">
                    {/* Badge de tipo */}
                    <div className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border ${getDiscountColor(promotion.discountType).split(' ')[2]}`}>
                      {getDiscountIcon(promotion.discountType)}
                      <span className={`text-sm font-semibold uppercase tracking-wider ${getDiscountTextColor(promotion.discountType)}`}>
                        {promotion.discountType === 'percentage' ? 'PORCENTAGEM' : 'VALOR FIXO'}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      {decodeText(promotion.title)}
                    </h3>

                    {/* Descrição */}
                    {promotion.description && (
                      <p className="text-white/90 mb-6 line-clamp-2">
                        {decodeText(promotion.description)}
                      </p>
                    )}

                    {/* Valor do desconto */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className={`text-5xl font-black ${getDiscountTextColor(promotion.discountType)}`}>
                        {promotion.discountType === 'percentage' 
                          ? `${promotion.discountValue}%`
                          : `R$${promotion.discountValue}`
                        }
                      </span>
                      <span className="text-xl font-semibold text-white/90">
                        OFF
                      </span>
                    </div>

                    {/* Data de validade */}
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Válido até {new Date(promotion.endDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Pedido mínimo */}
                    {promotion.minOrderValue && (
                      <div className="mt-3 text-white/80 text-sm">
                        Pedido mínimo: R$ {promotion.minOrderValue.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Indicador de ativo */}
                {index === currentIndex && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-emerald-400 text-black rounded-full p-2 animate-bounce">
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navegação */}
          {promotions.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                aria-label="Promoção anterior"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-emerald-400 w-8' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Ir para promoção ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % promotions.length)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                aria-label="Próxima promoção"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Fullscreen com GSAP Flip */}
      {isModalOpen && selectedPromotion && (
        <div 
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div 
            ref={modalContentRef}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Conteúdo do modal */}
            <div className={`bg-gradient-to-br ${getDiscountColor(selectedPromotion.discountType)} backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/10`}>
              {/* Imagem grande */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
                <LazyImage
                  src={selectedPromotion.bannerImage || `https://picsum.photos/seed/${selectedPromotion.id}/800/400.jpg`}
                  alt={selectedPromotion.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo detalhado */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-6">
                  {getDiscountIcon(selectedPromotion.discountType)}
                  <h2 className="text-4xl font-bold">{selectedPromotion.title}</h2>
                </div>

                {selectedPromotion.description && (
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    {selectedPromotion.description}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Detalhes da Promoção</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-5xl font-black ${getDiscountTextColor(selectedPromotion.discountType)}`}>
                          {selectedPromotion.discountType === 'percentage' 
                            ? `${selectedPromotion.discountValue}%`
                            : `R$${selectedPromotion.discountValue}`
                          }
                        </span>
                        <span className="text-2xl font-semibold text-white">OFF</span>
                      </div>
                      
                      {selectedPromotion.minOrderValue && (
                        <p className="text-lg">
                          Pedido mínimo: <span className="font-bold">R$ {selectedPromotion.minOrderValue.toFixed(2)}</span>
                        </p>
                      )}
                      
                      <p className="text-lg">
                        Válido até: <span className="font-bold">
                          {new Date(selectedPromotion.endDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Como Usar</h3>
                    <div className="space-y-2 text-lg">
                      <p>1. Adicione produtos ao carrinho</p>
                      <p>2. O desconto será aplicado automaticamente</p>
                      <p>3. Aproveite sua economia!</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors text-lg">
                  Aproveitar Oferta Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
