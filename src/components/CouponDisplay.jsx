import { useState, useEffect, useRef } from "react";
import { fetchActiveCoupons } from "../services/api";
import { Tag, Copy, Gift, Ticket, CheckCircle } from "lucide-react";
import { gsap } from "gsap";

export default function CouponDisplay() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    if (coupons.length === 0) return;

    // Animação inicial dos cards
    timelineRef.current = gsap.timeline();
    
    cardRefs.current.forEach((card, index) => {
      if (card) {
        timelineRef.current.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
            rotationX: -10
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.6,
            delay: index * 0.15,
            ease: "power2.out"
          }
        );
      }
    });

    // Animação de hover para todos os cards
    cardRefs.current.forEach((card) => {
      if (card) {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -5,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      gsap.killTweensOf(cardRefs.current);
    };
  }, [coupons]);

  async function loadCoupons() {
    try {
      const data = await fetchActiveCoupons();
      const couponsData = data?.coupons || Array.isArray(data) ? data : [];
      setCoupons(Array.isArray(couponsData) ? couponsData : []);
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(code, event) {
    const button = event.currentTarget;
    
    // Animação do botão
    gsap.to(button, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    
    // Animação de sucesso
    gsap.fromTo(
      button,
      {
        backgroundColor: "rgb(16 185 129)",
        color: "rgb(0 0 0)"
      },
      {
        backgroundColor: "rgb(34 197 94)",
        color: "rgb(255 255 255)",
        duration: 0.3,
        ease: "power2.out"
      }
    );
    
    setTimeout(() => {
      setCopiedCode(null);
      // Reset da cor do botão
      gsap.to(button, {
        backgroundColor: "rgb(5 150 105)",
        color: "rgb(255 255 255)",
        duration: 0.3,
        ease: "power2.out"
      });
    }, 2000);
  }

  const getCouponIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <Ticket className="h-5 w-5" />;
      case 'fixed':
        return <Gift className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  const getCouponColor = (type) => {
    switch (type) {
      case 'percentage':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'fixed':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      default:
        return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
    }
  };

  const getCouponTextColor = (type) => {
    switch (type) {
      case 'percentage':
        return 'text-purple-400';
      case 'fixed':
        return 'text-blue-400';
      default:
        return 'text-emerald-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-zinc-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Tag className="h-8 w-8 text-emerald-400 animate-pulse" />
            Cupons Exclusivos
            <Ticket className="h-8 w-8 text-emerald-400 animate-pulse" />
          </h3>
          <p className="text-zinc-400 text-lg">
            Use esses códigos para ganhar descontos especiais em sua compra
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon, index) => (
            <div
              key={coupon.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`group relative overflow-hidden rounded-2xl border ${getCouponColor(coupon.discountType)} bg-gradient-to-br ${getCouponColor(coupon.discountType)} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
                }} />
              </div>

              {/* Conteúdo */}
              <div className="relative z-10">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCouponIcon(coupon.discountType)}
                      <h4 className="font-bold text-white text-xl tracking-wide" style={{ fontFamily: 'monospace' }}>
                        {coupon.code}
                      </h4>
                    </div>
                    
                    {coupon.description && (
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {coupon.description}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => copyToClipboard(coupon.code, e)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${getCouponColor(coupon.discountType)} bg-emerald-950/50 ${getCouponTextColor(coupon.discountType)} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    aria-label={`Copiar código ${coupon.code}`}
                  >
                    {copiedCode === coupon.code ? (
                      <CheckCircle className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Valor do desconto */}
                <div className="mb-4">
                  <div className={`text-3xl font-black ${getCouponTextColor(coupon.discountType)} mb-1`}>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}% OFF`
                      : `R$ ${coupon.discountValue.toFixed(2)} OFF`
                    }
                  </div>
                  
                  {coupon.maxUses && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{coupon.currentUses || 0} de {coupon.maxUses} usos</span>
                    </div>
                  )}
                </div>

                {/* Informações adicionais */}
                <div className="space-y-2 text-xs text-zinc-400">
                  {coupon.minOrderValue && (
                    <div className="flex items-center gap-2">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>Pedido mínimo: R$ {coupon.minOrderValue.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Válido até {new Date(coupon.endDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>

                {/* Feedback de cópia */}
                {copiedCode === coupon.code && (
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-3 text-center">
                      <p className="text-sm font-semibold text-emerald-300 flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Código copiado com sucesso!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Efeito de brilho ao hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Clique no código para copiar • Aplique no carrinho de compras
          </p>
        </div>
      </div>
    </div>
  );
}
