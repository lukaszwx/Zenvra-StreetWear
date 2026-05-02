import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  ArrowRight, 
  MessageCircle, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Bookmark, 
  Share2, 
  Sparkles 
} from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";

function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctasRef = useRef(null);
  const statsRef = useRef(null);
  const cardRef = useRef(null);
  
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState('idle'); // idle, copied, sharing
  
  const whatsappLink = createGenericWhatsappLink(
    WHATSAPP_NUMBER,
    "Olá! Quero atendimento para escolher meu próximo produto na Zenvra."
  );

  const stats = [
    { value: "+20", label: "peças" },
    { value: "100%", label: "curadoria premium" },
    { value: "WhatsApp", label: "compra rápida", icon: Zap }
  ];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = async () => {
    setShareState('sharing');
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Zenvra - Streetwear Premium',
          text: 'Vista presença. Compre estilo.',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch (err) {
      console.log('Share failed:', err);
      setShareState('idle');
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação de entrada
      const tl = gsap.timeline();
      
      tl.fromTo(badgeRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(ctasRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(cardRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.4"
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      id="inicio" 
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405] pt-28 pb-20 sm:pt-32 sm:pb-24"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-emerald-300/5 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* LEFT - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div 
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">
                Nova coleção
              </span>
            </div>

            {/* Title */}
            <div ref={titleRef}>
              <h1 className="text-4xl font-black leading-tight text-[#f3f4f6] sm:text-5xl lg:text-6xl">
                Vista presença.
                <span className="block text-emerald-400">Compre estilo.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <div ref={subtitleRef}>
              <p className="text-lg leading-relaxed text-zinc-300 sm:text-xl">
                Sneakers, roupas e acessórios selecionados para quem busca um visual urbano, 
                premium e fácil de comprar pelo WhatsApp.
              </p>
            </div>

            {/* CTAs */}
            <div ref={ctasRef} className="flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-bold text-black transition-all hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/25 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1a21]"
              >
                <MessageCircle className="h-5 w-5" />
                Comprar pelo WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#produtos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-800/50 px-6 py-3 font-semibold text-[#f3f4f6] transition-all hover:border-zinc-500 hover:bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0f1a21] backdrop-blur-sm"
              >
                <ShoppingBag className="h-5 w-5" />
                Ver produtos
              </a>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {stat.icon && <stat.icon className="h-4 w-4 text-emerald-400" />}
                    <strong className="text-lg font-bold text-[#f3f4f6]">{stat.value}</strong>
                  </div>
                  <span className="text-xs text-zinc-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Visual Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-400/20 via-emerald-300/10 to-transparent blur-2xl" />
            
            {/* Card */}
            <div 
              ref={cardRef}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 shadow-2xl backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-emerald-400/10"
            >
              {/* Image */}
              <img
                src="/images/hero.png"
                alt="Campanha streetwear premium da Zenvra"
                className="h-[400px] w-full object-cover sm:h-[500px] lg:h-[600px]"
              />

              {/* Action buttons overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleLike}
                  aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  aria-pressed={liked}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      liked ? 'fill-red-500 text-red-500' : 'text-white'
                    }`} 
                  />
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  aria-label={saved ? "Remover salvos" : "Salvar campanha"}
                  aria-pressed={saved}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <Bookmark 
                    className={`h-5 w-5 transition-colors ${
                      saved ? 'fill-emerald-400 text-emerald-400' : 'text-white'
                    }`} 
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Compartilhar campanha"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <Share2 className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Share feedback */}
              {shareState === 'copied' && (
                <div className="absolute bottom-4 left-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                  Link copiado!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;