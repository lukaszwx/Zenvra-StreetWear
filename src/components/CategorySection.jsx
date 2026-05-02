import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowRight, 
  Sparkles, 
  Grid3X3, 
  Heart, 
  Bookmark, 
  Share2, 
  Eye,
  ShoppingBag,
  TrendingUp,
  Star
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'sneakers',
    name: "Sneakers",
    description: "Modelos exclusivos para performance e lifestyle urbano. Das pistas às ruas, com design inovador.",
    image: "/images/velocityOne.png",
    icon: TrendingUp,
    stats: { items: 25, trending: true, rating: 4.8 }
  },
  {
    id: 'roupas',
    name: "Roupas",
    description: "Peças premium para compor o visual completo. Streetwear autêntico com toque sofisticado.",
    image: "/images/ZenvraBlock.png",
    icon: ShoppingBag,
    stats: { items: 40, trending: false, rating: 4.9 }
  },
  {
    id: 'acessorios',
    name: "Acessórios",
    description: "Itens essenciais para rotina streetwear. Detalhes que fazem toda a diferença.",
    image: null,
    icon: Grid3X3,
    stats: { items: 15, trending: true, rating: 4.7 }
  }
];

function CategorySection({ onSelectCategory }) {
  const [likedCategories, setLikedCategories] = useState(new Set());
  const [savedCategories, setSavedCategories] = useState(new Set());
  const [shareState, setShareState] = useState('idle');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    if (categories.length === 0) return;

    // Limpar ScrollTriggers anteriores
    scrollTriggersRef.current.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    scrollTriggersRef.current = [];

    // Animações GSAP Apple-style cinematográficas
    const ctx = gsap.context(() => {
      // Animação de entrada dos headers
      gsap.fromTo(".category-header",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power4.out"
        }
      );

      // Animação em cascata dos cards
      gsap.fromTo(cardRefs.current.filter(Boolean),
        { 
          opacity: 0, 
          y: 60, 
          scale: 0.9,
          rotationX: 15,
          transformPerspective: 1000
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotationX: 0,
          duration: 1.2, 
          ease: "power4.out",
          stagger: 0.2
        }
      );

      // Parallax profundo nos cards
      cardRefs.current.filter(Boolean).forEach((card, index) => {
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          onUpdate: (self) => {
            gsap.to(card, {
              y: self.progress * -30,
              scale: 1 + (self.progress * 0.05),
              rotationY: self.progress * 10,
              ease: "none",
              transformPerspective: 1000
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
  }, []);

  const handleLike = (categoryId) => {
    setLikedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSave = (categoryId) => {
    setSavedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleShare = async (category) => {
    setShareState('sharing');
    
    try {
      const text = `Confira os ${category.name} na Zenvra: ${category.description}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Zenvra - ${category.name}`,
          text,
          url: `${window.location.href}#${category.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${text} - ${window.location.href}#${category.id}`);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch (err) {
      console.log('Share failed:', err);
      setShareState('idle');
    }
  };

  const handleCategoryClick = (category) => {
    // Animação de clique
    gsap.to(event.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        if (onSelectCategory) {
          onSelectCategory(category);
        }
      }
    });
  };

  return (
    <section 
      ref={containerRef}
      id="categorias" 
      className="relative py-24 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405] overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 h-96 w-96 rounded-full bg-emerald-400/8 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 h-64 w-64 rounded-full bg-emerald-300/6 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-zinc-800/4 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="category-header text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">CATEGORIAS EXCLUSIVAS</span>
          </div>
          
          <h2 className="text-5xl font-black leading-tight text-[#f3f4f6] sm:text-6xl mb-8">
            Explore por
            <span className="block text-emerald-400">estilo.</span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Descubra nossa curadoria premium de sneakers, roupas e acessórios. 
            Cada categoria selecionada para elevar seu streetwear ao próximo nível.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isLiked = likedCategories.has(category.id);
            const isSaved = savedCategories.has(category.id);
            const isHovered = hoveredCategory === category.id;
            
            return (
              <div
                key={category.id}
                ref={el => cardRefs.current[index] = el}
                className="group relative"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-400/15 via-emerald-300/8 to-transparent blur-2xl transition-all duration-700 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`} />
                
                {/* Card */}
                <div 
                  onClick={() => handleCategoryClick(category)}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-emerald-400/20"
                >
                  {/* Header com imagem */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {category.image ? (
                      <>
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.08]"
                        />
                        {/* Overlay gradiente */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-transparent transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />
                      </>
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-zinc-600" />
                      </div>
                    )}

                    {/* Badge de trending */}
                    {category.stats.trending && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className={`absolute top-4 right-4 z-10 flex gap-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(category.id);
                        }}
                        aria-pressed={isLiked}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${
                            isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                          }`} 
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(category.id);
                        }}
                        aria-pressed={isSaved}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <Bookmark 
                          className={`h-5 w-5 transition-colors ${
                            isSaved ? 'fill-emerald-400 text-emerald-400' : 'text-white'
                          }`} 
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(category);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <Share2 className="h-5 w-5 text-white" />
                      </button>
                    </div>

                    {/* Stats overlay */}
                    <div className={`absolute bottom-4 left-4 z-10 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                      <div className="flex items-center gap-3 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-emerald-400" />
                          <span className="text-xs text-white">{category.stats.rating}</span>
                        </div>
                        <div className="text-xs text-zinc-300">{category.stats.items} itens</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Icon e nome */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                        <Icon className="h-6 w-6 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-300 leading-relaxed mb-8 line-clamp-3">
                      {category.description}
                    </p>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className="group/btn flex w-full items-center justify-between rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 backdrop-blur-sm transition-all hover:bg-emerald-400/20 hover:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1a21]"
                    >
                      <span className="font-semibold text-emerald-400">Explorar categoria</span>
                      <ArrowRight className="h-5 w-5 text-emerald-400 transition-transform group-hover/btn:translate-x-2" />
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
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-600/30 bg-zinc-800/50 px-6 py-3 backdrop-blur-sm">
            <Eye className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-300">
              Explore todas as categorias e encontre seu estilo único
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
